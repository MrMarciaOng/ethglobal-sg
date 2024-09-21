# Include .env file
-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil scopefile deploy-mock-usdt deploy-payment-gateway verify

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

all: remove install build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install foundry-rs/forge-std --no-commit && forge install openzeppelin/openzeppelin-contracts@v4.8.3 --no-commit && forge install openzeppelin/openzeppelin-contracts-upgradeable@v4.8.3 --no-commit && forge install cyfrin/foundry-devops --no-commit && forge install transmission11/solmate --no-commit

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test 

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network sepolia,$(ARGS)),--network sepolia)
	NETWORK_ARGS := --rpc-url $(SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY_DEPLOYER) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY) -vvvvv
endif

ifeq ($(findstring --network hedera-testnet,$(ARGS)), --network hedera-testnet)
	NETWORK_ARGS := --rpc-url https://testnet.hashio.io/api --private-key $(PRIVATE_KEY_DEPLOYER) --broadcast --verify --verifier sourcify --verifier-url https://server-verify.hashscan.io -vvvv
endif

# Scripts
deploy-mock-usdt:
	@forge script script/DeployMockUsdt.s.sol:DeployMockUsdt $(NETWORK_ARGS)

deploy-payment-gateway:
	@forge script script/DeployPaymentGatewaySepolia.s.sol:DeployPaymentGateway $(NETWORK_ARGS)

deploy-payment-gateway-anvil:
	@forge script script/DeployPaymentGatewayAnvil.s.sol:DeployPaymentGateway $(NETWORK_ARGS)

# Verification
verify:
	@forge verify-contract $(CONTRACT_ADDRESS) $(CONTRACT_NAME) --chain-id $(CHAIN_ID) --num-of-optimizations 200 --compiler-version $(COMPILER_VERSION) $(NETWORK_ARGS)

verify-amoy:
	@forge verify-contract $(CONTRACT_ADDRESS) $(CONTRACT_NAME) --watch --rpc-url $(AMOY_RPC_URL) --verifier-url $(AMOY_VERIFIER_URL) --api-key $(AMOY_API_KEY) --chain 80002