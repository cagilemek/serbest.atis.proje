# 🏀 Free Throw Project

Basketball free throw prediction game developed on the Stacks blockchain. Players make predictions for 3 shots, perform actual shots, and earn STX tokens if their predictions are correct!

## 🎯 How the Game Works

1. **Prediction Phase**: Make your predictions for 3 free throws (make/miss)
2. **Shooting Phase**: Simulate your actual shots
3. **Reward Phase**: Earn 1 STX token if your predictions perfectly match your shots!

## 🛠️ Technology Stack

### Blockchain
- **Clarity Smart Contracts**: Game logic and token management
- **Stacks Blockchain**: Smart contract platform with Bitcoin security
- **STX Token**: Native token for reward system

### Frontend
- **Next.js 14**: Modern React-based web framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Modern and responsive UI
- **Stacks.js**: Blockchain integration

### Development Tools
- **Clarinet**: Smart contract development and testing environment
- **Vitest**: Testing framework
- **ESLint & Prettier**: Code quality

## 🚀 Installation and Setup

### Requirements
- Node.js 18+
- npm or yarn
- Clarinet CLI
- Hiro Wallet or Xverse Wallet

### Installation
```bash
# Clone the project
git clone <project-url>
cd free-throw-project

# Install dependencies
npm install

# Run smart contract tests
npm test

# Start development server
npm run dev
```

### Production Build
```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🔧 Smart Contract

### Main Functions

- `start-game(predictions)`: Starts a new game
- `take-shots(shots)`: Performs the shots
- `reset-game()`: Resets the game
- `get-game-stats(player)`: Gets player statistics

### Data Structures

```clarity
{
  predictions: (list 3 bool),
  shots: (list 3 bool),
  completed: bool,
  reward-claimed: bool
}
```

## 🎮 Usage

1. **Wallet Connection**: Connect with Hiro Wallet or Xverse
2. **Making Predictions**: Choose "Make" or "Miss" for each shot
3. **Starting Game**: Send your predictions to the blockchain
4. **Taking Shots**: Perform your 3 shots sequentially
5. **Results**: Automatically earn tokens if predictions are correct

## 📱 Features

- ✅ Responsive design (mobile-friendly)
- ✅ Real-time blockchain integration
- ✅ Animated basketball court
- ✅ Detailed statistics tracking
- ✅ Secure wallet connection
- ✅ English interface

## 🧪 Testing

```bash
# Smart contract tests
npm test

# Test reports
npm run test:reports

# Watch mode
npm run test:watch
```

## 📝 Contract Deployment

### Testnet
```bash
clarinet deployments generate --devnet
clarinet deployments apply --devnet
```

### Mainnet
```bash
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

## 🔐 Security

- ✅ Secure transactions with post-conditions
- ✅ Input validation
- ✅ Overflow/underflow protection
- ✅ Reentrancy protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🔗 Links

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language](https://docs.stacks.co/clarity)
- [Hiro Wallet](https://wallet.hiro.so)
- [Xverse Wallet](https://www.xverse.app)

## 💡 Future Features

- [ ] Multiplayer mode
- [ ] Tournament system
- [ ] NFT rewards
- [ ] Leaderboard
- [ ] Social features
- [ ] Mobile app

## ⚠️ Note

This project was developed for educational purposes. Perform comprehensive testing before using on mainnet.

---

**Developer**: Built with Stacks & Clarity Smart Contracts
**Blockchain**: Stacks (Bitcoin Layer 2)
**Framework**: Next.js + TypeScript + Tailwind CSS
