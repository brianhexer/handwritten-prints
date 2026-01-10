# Installation & Setup

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/brianhexer/handwritten-prints.git
   cd handwritten-prints
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

## Using via Browser

No installation needed! Just visit:
[https://brianhexer.github.io/handwritten-prints/](https://brianhexer.github.io/handwritten-prints/)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run format` - Format code (prettier + eslint)
- `npm run test` - Run cypress tests
- `npm run cy` - Open cypress test runner

## NPM Package

Install as an npm package:
```bash
npm install handwritten-prints
```

Or with yarn:
```bash
yarn add handwritten-prints
```

## Docker (Optional)

If you want to run in Docker:
```bash
docker run -p 3000:3000 brianhexer/handwritten-prints
```

## Troubleshooting

**Issue: Port 3000 already in use**
```bash
# Use different port
npm run dev -- --port 3001
```

**Issue: Dependencies not installing**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Check [[Usage Guide]] to learn how to use the tool
- See [[Contributing]] if you want to contribute

