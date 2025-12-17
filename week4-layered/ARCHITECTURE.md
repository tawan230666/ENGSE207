# Architecture Diagram

## High-Level Architecture Flow

```mermaid
graph TD
    Client[Client / Browser] -->|HTTP Request| Controller[Presentation Layer\n(Controllers)]
    
    subgraph "Backend Application"
        Controller -->|Call Logic| Service[Business Logic Layer\n(Services)]
        Service -->|Validation OK| Repo[Data Access Layer\n(Repositories)]
        
        Repo -->|SQL Query| DB[(SQLite Database)]
        DB -->|Data| Repo
        
        Repo -->|Object| Service
        Service -->|Result| Controller
    end
    
    Controller -->|JSON Response| Client