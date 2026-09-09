# ERP Application

This repository contains the implementation of an ERP (Enterprise Resource Planning) Application designed to manage companies, industries, vendors, vendor categories, financial transactions, bank statements, and invoices.

The application allows users to create and manage companies, associate them with their respective industries, manage vendors based on vendor categories, generate bank statements for company-vendor transactions, and generate invoices for selected transactions using predefined invoice templates.

🚀 Features
🏢 Company Management
Create and manage companies.
Associate companies with their respective industries.
Maintain company-related information required for financial transactions.
🏭 Industry Management
Create and manage industries.
Define the industry type/company domain.
Associate companies with the appropriate industry.
📂 Vendor Category Management
Create and manage vendor categories.
Categorize vendors according to their services or business type.
🤝 Vendor Management
Create and manage vendors.
Associate vendors with vendor categories.
Maintain vendor information for company transactions.

Examples of vendors can include:

AWS
Microsoft Azure
Google Cloud
Other subscription/service providers
💳 Transaction & Statement Generator

The Generator module allows users to generate bank statements for transactions between a company and its vendors.

Transactions can represent:

Income
Expense

The application calculates the closing balance based on the transactions.

Closing Balance = Opening Balance + Total Income - Total Expenses

For example:

Opening Balance = ₹100,000
Total Income    = ₹50,000
Total Expenses  = ₹30,000

Closing Balance = ₹100,000 + ₹50,000 - ₹30,000
                = ₹120,000

The generated statement contains the relevant transaction information and calculated balances.

🧾 Invoice Generation

Users can select transactions from the generated bank statement and generate invoices based on those transactions.

Invoice generation supports:

Selecting transactions
Generating invoices for selected transactions
Using predefined invoice templates
Maintaining invoice-related information
🎨 Template Management

The Template module allows users to manage templates used for generating invoices and other financial documents.

Templates provide a consistent structure and appearance for generated documents.

📜 Transaction History

The Generator module maintains a history of previously generated or processed transactions/statements.

Users can view transaction history to track financial activities performed through the application.

⚙️ Settings

The Settings module provides application-level configuration and management options.
