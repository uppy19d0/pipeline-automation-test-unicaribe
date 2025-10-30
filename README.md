# CI Simple Node Project 🚀

A comprehensive Node.js project featuring **Express.js API**, **utility functions**, **comprehensive testing**, and **CI/CD pipeline** with GitHub Actions.

## ✨ Features

- **RESTful API** with Express.js
- **Calculator utilities** with advanced mathematical operations
- **String, array, and date utilities**
- **Comprehensive test suite** with Jest
- **Code quality tools** (ESLint, Prettier)
- **Docker support** with multi-stage builds
- **CI/CD pipeline** with GitHub Actions
- **Health checks** and monitoring
- **Error handling** and input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Testing**: Jest with coverage reporting
- **Code Quality**: ESLint + Prettier
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd ci-simple-node-project

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# For development with hot reload
docker-compose --profile dev up
```

## 📁 Project Structure

```text
ci-simple-node-project/
├── src/
│   ├── server.js          # Express.js server
│   ├── calculator.js      # Calculator utilities
│   ├── utils.js          # General utilities
│   └── sum.js            # Legacy sum function
├── __tests__/
│   ├── server.test.js    # API endpoint tests
│   ├── calculator.test.js # Calculator tests
│   ├── utils.test.js     # Utilities tests
│   └── sum.test.js       # Legacy tests
├── .github/workflows/
│   └── ci.yml            # CI/CD pipeline
├── reports/              # Test reports (generated)
├── coverage/             # Coverage reports (generated)
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── .env.example         # Environment variables template
└── package.json         # Project configuration
```

## 🔌 API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check

### Calculator Operations
- `POST /api/calculator/add` - Addition
- `POST /api/calculator/subtract` - Subtraction  
- `POST /api/calculator/multiply` - Multiplication
- `POST /api/calculator/divide` - Division
- `POST /api/calculator/power` - Exponentiation
- `POST /api/calculator/sqrt` - Square root
- `POST /api/calculator/factorial` - Factorial

### Utility Functions
- `POST /api/utils/array-sum` - Sum array elements
- `POST /api/utils/array-average` - Calculate array average
- `POST /api/utils/capitalize` - Capitalize string
- `POST /api/utils/reverse-string` - Reverse string
- `POST /api/utils/is-palindrome` - Check if palindrome
- `POST /api/utils/is-prime` - Check if prime number
- `POST /api/utils/fibonacci` - Calculate fibonacci number

### Legacy
- `POST /api/sum` - Legacy sum function

## 📝 API Usage Examples

### Calculator Addition
```bash
curl -X POST http://localhost:3000/api/calculator/add \
  -H "Content-Type: application/json" \
  -d '{"a": 5, "b": 3}'

# Response: {"result": 8, "operation": "addition", "operands": [5, 3]}
```

### String Utilities
```bash
curl -X POST http://localhost:3000/api/utils/capitalize \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world"}'

# Response: {"result": "Hello world", "operation": "capitalize", "original": "hello world"}
```

### Array Operations
```bash
curl -X POST http://localhost:3000/api/utils/array-sum \
  -H "Content-Type: application/json" \
  -d '{"array": [1, 2, 3, 4, 5]}'

# Response: {"result": 15, "operation": "array_sum", "array": [1, 2, 3, 4, 5]}
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit tests** for all utility functions
- **Integration tests** for API endpoints
- **Error handling tests** for edge cases
- **Code coverage reporting**

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development
API_VERSION=1.0.0
LOG_LEVEL=info
```

### Code Quality

The project uses ESLint and Prettier for code quality:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🚢 CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Code Quality Checks**
   - ESLint linting
   - Prettier formatting validation

2. **Testing**
   - Matrix testing on Node.js 18 & 20
   - Jest unit and integration tests
   - Coverage reporting

3. **Docker Build**
   - Multi-platform Docker image build
   - Container health check testing

4. **Artifacts**
   - Test reports (JUnit format)
   - Coverage reports
   - Docker images

## 🐳 Docker Support

### Development
```bash
# Start development environment
docker-compose --profile dev up

# Build production image
docker build -t ci-simple-node-project .

# Run production container
docker run -p 3000:3000 ci-simple-node-project
```

### Production
```bash
# Start production environment
docker-compose up -d

# View logs
docker-compose logs -f

# Scale the application
docker-compose up -d --scale app=3
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js community for the excellent web framework
- Jest team for the comprehensive testing framework
- GitHub Actions for seamless CI/CD integration
