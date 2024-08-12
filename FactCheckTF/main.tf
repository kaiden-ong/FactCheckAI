provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "factcheck_rg" {
  name     = "FactCheckAI-RG"
  location = "West US 3"
}

resource "azurerm_service_plan" "factcheck_sp" {
  name                = "FactCheckAI-SP"
  resource_group_name = azurerm_resource_group.factcheck_rg.name
  location            = azurerm_resource_group.factcheck_rg.location
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "factcheck_lwa" {
  name                = "FactCheckAI"
  resource_group_name = azurerm_resource_group.factcheck_rg.name
  location            = azurerm_service_plan.factcheck_sp.location
  service_plan_id     = azurerm_service_plan.factcheck_sp.id

  site_config {
    always_on        = false
    application_stack {
      node_version = "20-lts"
    }
  }
}