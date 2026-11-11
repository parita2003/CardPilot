CARDPILOT

Architecture & Implementation Notes



Live Application: https://cardpilot-vimz.onrender.com/
GitHub Repository: https://github.com/parita2003/CardPilot
Remote MCP Endpoint: https://cardpilot-vimz.onrender.com/mcp

⸻

1. SYSTEM ARCHITECTURE

Architecture Diagram

The architecture separates conversational intelligence from application execution. Claude interprets user requests and invokes MCP tools, while CardPilot handles application logic, data operations and the live dashboard.

                 END USER
                     |
             Natural-language request
                     |
                     v
              CLAUDE (CLIENT)
          Interprets user instructions
                     |
                     v
             MCP CONNECTOR
          Remote HTTPS MCP endpoint
                     |
                     v
           CARDPILOT MCP SERVER
           (Node.js + MCP SDK)
                     |
             Tool invocation
                     |
                     v
        NODE.JS + EXPRESS BACKEND
          Application / Business Logic
                     |
          +----------+-----------+
          |                      |
          v                      v
     CARD OPERATIONS       TRANSACTION OPERATIONS
          |                      |
          +----------+-----------+
                     |
                     v
          SHARED APPLICATION STATE
             In-memory JavaScript
                     |
          +----------+-----------+
          |                      |
          v                      v
       REST APIs             MCP RESPONSE
          |                      |
          v                      v
   CARDPILOT WEB DASHBOARD    CLAUDE RESPONSE
     HTML / CSS / JS
          |
          v
     USER REVIEWS
       AND EDITS

Hosting: The Node.js application, web dashboard and MCP endpoint are deployed on Render. GitHub is used for source-code version control.

Architecture Components

Component	Responsibility
Claude	Understands user instructions and decides which available tool to invoke.
MCP Connector	Provides the communication interface between Claude and CardPilot.
MCP Server	Exposes CardPilot operations as callable tools.
Express Backend	Handles HTTP requests, application logic and data operations.
Shared Application State	Holds card and transaction records used by both REST and MCP operations.
Web Dashboard	Displays records and allows users to add and review information.
Render	Hosts the publicly accessible application and MCP endpoint.

⸻

2. DATA FLOW

CardPilot supports two ways of interacting with the same application data.

A. Claude-to-Application Flow

1. The user enters a natural-language instruction in Claude.
2. Claude identifies the relevant CardPilot MCP tool.
3. The MCP connector forwards the tool request to the public MCP endpoint.
4. The MCP server validates the tool input and invokes the corresponding application operation.
5. The Node.js backend executes the operation against the shared application state.
6. The result is returned to Claude through MCP.
7. The user can open CardPilot and view the updated information.

Example: Adding a transaction

User instruction:

“Add a Starbucks transaction of ₹650 under Food using my HDFC Millennia card.”

The add_transaction tool receives the transaction details, the backend creates the record and Claude receives the operation result. The same transaction becomes visible in the CardPilot dashboard.

B. Dashboard-to-Backend Flow

1. The user opens the CardPilot web application.
2. The frontend requests card and transaction information through REST APIs.
3. Express retrieves the information from the shared application state.
4. The dashboard renders the records.
5. When the user adds a card or transaction through the interface, the frontend sends a POST request.
6. The backend validates and saves the new record in the shared application state.
7. The dashboard refreshes to display the updated information.

Both interaction paths use the same underlying application data, keeping the website and MCP operations aligned during the running session.

⸻

3. MCP TOOLS IMPLEMENTED

The current version exposes five MCP tools.

Tool	Functionality
get_my_cards	Retrieves all saved credit cards and their configured details.
get_transactions	Retrieves transaction history.
add_transaction	Creates a transaction with merchant, amount, category, card and date.
add_credit_card	Adds a card with issuer, last four digits, annual fee and waiver threshold.
calculate_rewards	Estimates rewards using configured card reward rules.

These tools demonstrate both read and write operations through Claude.

⸻

4. VOLOPAY VERSUS PARTNER RESPONSIBILITIES

The architecture follows a separation-of-responsibilities model.

Responsibility	Claude / Customer’s AI Provider	CardPilot Application
Understand natural-language instructions	Yes	No
Interpret user intent	Yes	No
Select an appropriate MCP action	Yes	Exposes available tools
Generate conversational explanations	Yes	No
Store credit card records	No	Yes
Store transaction records	No	Yes
Execute application business logic	No	Yes
Calculate configured reward estimates	Requests calculation	Executes calculation
Maintain the dashboard	No	Yes
Allow users to review and edit records	No	Yes

Important distinction: Claude is an external customer-owned interface. CardPilot does not embed an AI model, call an AI API or require an AI API key.

In a production deployment, CardPilot would remain responsible for application operations, while the customer’s chosen AI provider would remain responsible for reasoning and natural-language interaction.

⸻

5. TECHNOLOGY AND TOOLS USED

Layer	Technology
Frontend	HTML5, CSS3, Vanilla JavaScript
Backend	Node.js
Server framework	Express.js
AI integration protocol	Model Context Protocol
MCP implementation	@modelcontextprotocol/sdk
Input validation	Zod
Communication	HTTP, REST APIs, JSON
Hosting	Render
Version control	Git and GitHub

The first version intentionally uses a lightweight architecture to demonstrate the end-to-end product workflow without introducing unnecessary infrastructure.

⸻

6. ASSUMPTIONS

The current implementation is based on the following assumptions:

1. Users have access to their own compatible Claude account and can configure a custom remote MCP connector.
2. Users manually add their credit card details and transactions.
3. Only non-sensitive card metadata, such as the last four digits, is used in the prototype.
4. Reward rates, annual fees and fee-waiver thresholds are configured as illustrative sample values.
5. Claude is responsible for understanding the user’s request, while CardPilot is responsible for executing the requested application operation.
6. The initial product focuses on individual credit-card management rather than direct banking integrations.

⸻

7. CURRENT IMPLEMENTATION VS PROPOSED PRODUCTION SYSTEM

An important distinction is that the submitted version is a working MVP, not a fully production-ready financial platform.

Area	Built in Current MVP	Proposed Production System
Frontend	Functional dashboard with card and transaction views	Responsive, accessible interface with personalised user accounts
Backend	Node.js and Express APIs	Scalable, modular backend services
Data storage	In-memory JavaScript state	Persistent PostgreSQL database
User management	Public demo application without login	Secure authentication and account isolation
MCP	Five working tools	Expanded tools with granular permissions and audit trails
Transactions	Manual transaction entry	Consent-based statement imports and authorised integrations
Rewards	Configured illustrative reward rules	Verified, versioned issuer-specific reward rules
Notifications	Sample payment reminders	Scheduled, configurable email or push notifications
Security	Prototype-level validation	Encryption, access controls, rate limiting and security monitoring
Deployment	Render hosting	Production-grade deployment with monitoring, backups and scaling

⸻

8. LIMITATIONS OF THE CURRENT MVP

* Data is held in memory and may reset when the application restarts or is redeployed.
* The application is not connected to actual bank accounts, card networks or payment gateways.
* Reward calculations use illustrative configurations and are not verified against current issuer terms.
* The current application is a public demonstration and does not implement multi-user authentication or account-level data isolation.
* Payment reminders and financial information are demonstration features rather than verified bank notifications.
* The application is not intended to process payments or make financial decisions on behalf of users.

No full card numbers, CVVs, PINs, OTPs or banking credentials should be entered into the prototype.

⸻

9. NEXT STEPS

The proposed roadmap focuses on moving from a functional demonstration to a reliable product.

Phase 1 — Reliability and Persistence

* Introduce PostgreSQL for persistent data storage.
* Implement user authentication and account-level access controls.
* Add transaction validation, error handling and audit logging.
* Improve monthly reward-cap calculations and fee-waiver tracking.

Phase 2 — Product Expansion

* Introduce configurable card reward rules.
* Add recurring payment reminders and downloadable spending reports.
* Support secure statement imports with user consent.
* Improve MCP tool descriptions, validation and permission handling.

Phase 3 — Production Readiness

* Conduct security and privacy reviews.
* Introduce monitoring, backups and service-level alerts.
* Explore authorised financial data integrations where legally and technically supported.
* Validate pricing, retention and customer acquisition through a controlled beta.

⸻

10. PROJECT ACCESS AND VALIDATION

Live application:
https://cardpilot-vimz.onrender.com/

Source code:
https://github.com/parita2003/CardPilot

MCP endpoint:
https://cardpilot-vimz.onrender.com/mcp

Validation performed:

* Successfully deployed the application on Render.
* Confirmed public dashboard accessibility.
* Verified card and transaction API responses.
* Connected the remote MCP endpoint to Claude.
* Confirmed that all five MCP tools are available.
* Retrieved four credit cards through Claude.
* Added a transaction through Claude and verified that it appeared in the live dashboard.

⸻

CONCLUSION

CardPilot demonstrates how an application can deliver persistent, useful functionality without embedding an AI model.

Claude provides the conversational intelligence. MCP connects that intelligence to CardPilot. The application handles data, business logic, editing and live availability.

Claude thinks. CardPilot executes. Users stay in control.

Built by Parita Mendapara
Volopay Product & Tech Assignment
