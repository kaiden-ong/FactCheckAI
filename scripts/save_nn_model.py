import torch
from torch import nn
import pandas as pd
from torchtext.data.utils import get_tokenizer
from torchtext.vocab import build_vocab_from_iterator
from torch.utils.data import DataLoader
import time


df_fake = pd.read_csv('data/DataSet_Misinfo_FAKE.csv')
df_fake = df_fake.dropna()
df_real = pd.read_csv('data/DataSet_Misinfo_TRUE.csv')
df_real = df_real.dropna()
df_fake['truth'] = 0
df_real['truth'] = 1
df = pd.concat([df_real, df_fake])
df = df.drop('Unnamed: 0', axis=1)

tokenizer = get_tokenizer("basic_english")
train_iter = df(split="train")

def yield_tokens(data_iter):
    for _, text in data_iter:
        yield tokenizer(text)

vocab = build_vocab_from_iterator(yield_tokens(train_iter), specials=["<unk>"])
vocab.set_default_index(vocab["<unk>"])

text_pipeline = lambda x: vocab(tokenizer(x))
label_pipeline = lambda x: int(x) - 1

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def collate_batch(batch):
    label_list, text_list, offsets = [], [], [0]
    for _label, _text in batch:
        label_list.append(label_pipeline(_label))
        processed_text = torch.tensor(text_pipeline(_text), dtype=torch.int64)
        text_list.append(processed_text)
        offsets.append(processed_text.size(0))
    label_list = torch.tensor(label_list, dtype=torch.int64)
    offsets = torch.tensor(offsets[:-1]).cumsum(dim=0)
    text_list = torch.cat(text_list)
    return label_list.to(device), text_list.to(device), offsets.to(device)


train_iter = df(split="train")
dataloader = DataLoader(
    train_iter, batch_size=8, shuffle=False, collate_fn=collate_batch
)

class TextClassificationModel(nn.Module):
    def __init__(self, vocab_size, embed_dim, num_class):
        super(TextClassificationModel, self).__init__()
        self.embedding = nn.EmbeddingBag(vocab_size, embed_dim, sparse=False)
        self.fc = nn.Linear(embed_dim, num_class)
        self.init_weights()

    def init_weights(self):
        initrange = 0.5
        self.embedding.weight.data.uniform_(-initrange, initrange)
        self.fc.weight.data.uniform_(-initrange, initrange)
        self.fc.bias.data.zero_()

    def forward(self, text, offsets):
        embedded = self.embedding(text, offsets)
        return self.fc(embedded)

num_class = len(set([label for (label, text) in train_iter]))
vocab_size = len(vocab)
emsize = 64
model = TextClassificationModel(vocab_size, emsize, num_class).to(device)

# def train(dataloader):
#     model.train()
#     total_acc, total_count = 0, 0
#     log_interval = 500
#     start_time = time.time()

#     for idx, (label, text, offsets) in enumerate(dataloader):
#         optimizer.zero_grad()
#         predicted_label = model(text, offsets)
#         loss = criterion(predicted_label, label)
#         loss.backward()
#         torch.nn.utils.clip_grad_norm_(model.parameters(), 0.1)
#         optimizer.step()
#         total_acc += (predicted_label.argmax(1) == label).sum().item()
#         total_count += label.size(0)
#         if idx % log_interval == 0 and idx > 0:
#             elapsed = time.time() - start_time
#             print(
#                 "| epoch {:3d} | {:5d}/{:5d} batches "
#                 "| accuracy {:8.3f}".format(
#                     epoch, idx, len(dataloader), total_acc / total_count
#                 )
#             )
#             total_acc, total_count = 0, 0
#             start_time = time.time()


# def evaluate(dataloader):
#     model.eval()
#     total_acc, total_count = 0, 0

#     with torch.no_grad():
#         for idx, (label, text, offsets) in enumerate(dataloader):
#             predicted_label = model(text, offsets)
#             loss = criterion(predicted_label, label)
#             total_acc += (predicted_label.argmax(1) == label).sum().item()
#             total_count += label.size(0)
#     return total_acc / total_count