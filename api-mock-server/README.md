# API Mock Server Generator

A Node.js CLI tool that generates a mock REST API server from a simple YAML/JSON config file.

## Features

- **Config-Driven**: Define your API in a simple YAML or JSON file
- **Auto-Generated Data**: Uses Faker.js to generate realistic fake data
- **Full CRUD Support**: GET (list + single), POST, PUT, DELETE
- **Configurable Delay**: Simulate network latency
- **Error Simulation**: Random 500s for testing error handling
- **CORS Enabled**: Cross-origin requests work out of the box
- **Hot-Reload**: Watch config file for changes and auto-restart
- **Customizable Port**: Run on any port you need

## Installation

```bash
npm install
```

Or install globally:

```bash
npm install -g .
```

## Usage

```bash
# Start with default config (api.yaml)
node bin/mock-server.js

# Specify a config file
node bin/mock-server.js --config examples/users-api.yaml

# Custom port
node bin/mock-server.js --port 4000

# Enable error simulation (10% chance of 500s)
node bin/mock-server.js --error-rate 10

# Add delay to responses (in ms)
node bin/mock-server.js --delay 500

# Watch for config changes
node bin/mock-server.js --watch

# Show help
node bin/mock-server.js --help
```

## Config Format

### Basic Structure

```yaml
port: 3001          # Server port (default: 3000)
base: /api          # Base path prefix (default: /)
delay: 100          # Response delay in ms (default: 0)
endpoints:
  - path: /users
    method: GET
    count: 10
    fields:
      id: increment
      name: name
      email: email
```

### Field Types

| Type | Description | Example Output |
|------|-------------|----------------|
| `increment` | Auto-incrementing ID | 1, 2, 3... |
| `param` | Use URL parameter | `:id` value |
| `name` | Full name | "John Doe" |
| `firstName` | First name | "John" |
| `lastName` | Last name | "Doe" |
| `email` | Email address | "john@example.com" |
| `avatar` | Avatar URL | "https://..." |
| `phone` | Phone number | "(555) 123-4567" |
| `address` | Full address | "123 Main St..." |
| `city` | City name | "New York" |
| `country` | Country name | "United States" |
| `zipCode` | ZIP code | "10001" |
| `title` | Job title | "Software Engineer" |
| `company` | Company name | "Acme Inc" |
| `lorem` | Lorem ipsum text | "Lorem ipsum..." |
| `sentence` | Random sentence | "The quick brown..." |
| `paragraph` | Random paragraph | "Lorem ipsum dolor..." |
| `url` | Random URL | "https://..." |
| `image` | Random image URL | "https://picsum.photos..." |
| `boolean` | Random true/false | true, false |
| `date` | Random date | "2024-01-15" |
| `pastDate` | Past date | "2023-06-20" |
| `futureDate` | Future date | "2025-03-10" |
| `price` | Random price | 49.99 |
| `rating` | Rating 1-5 | 4.2 |
| `uuid` | UUID | "550e8400-..." |
| `color` | Hex color | "#ff5733" |
| `ip` | IP address | "192.168.1.1" |
| `userAgent` | User agent string | "Mozilla/5.0..." |
| `word` | Random word | "hello" |
| `words` | Multiple words | "hello world foo" |
| `number` | Random number | 42 |
| `float` | Random float | 3.14 |
| `objectId` | MongoDB-like ID | "507f1f77..." |

### Special Endpoints

```yaml
endpoints:
  # List endpoint with multiple items
  - path: /users
    method: GET
    count: 10          # Generate 10 items
    fields:
      id: increment
      name: name
      email: email

  # Single item by ID
  - path: /users/:id
    method: GET
    fields:
      id: param        # Uses :id from URL
      name: name
      email: email

  # POST endpoint (returns created item)
  - path: /users
    method: POST
    fields:
      id: increment
      name: name
      email: email

  # PUT endpoint
  - path: /users/:id
    method: PUT
    fields:
      id: param
      name: name
      email: email

  # DELETE endpoint (returns success message)
  - path: /users/:id
    method: DELETE

  # Static response
  - path: /health
    method: GET
    static:
      status: ok
      timestamp: "{{date}}"
```

### Custom Response

```yaml
endpoints:
  - path: /error
    method: GET
    status: 404
    response:
      error: Not Found
      message: Resource not found
```

## Examples

See the `examples/` directory for sample config files:

- `api.yaml` - Basic API with users and posts
- `users-api.yaml` - Extended users API with more fields

## API Endpoints

Once running, your mock API will be available at:

```
GET    http://localhost:3001/api/users       # List users
GET    http://localhost:3001/api/users/1     # Get user by ID
POST   http://localhost:3001/api/users       # Create user
PUT    http://localhost:3001/api/users/1     # Update user
DELETE http://localhost:3001/api/users/1     # Delete user
```

## License

MIT
