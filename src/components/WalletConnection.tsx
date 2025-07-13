import React, { useState } from 'react';
import { Wallet, Shield, CheckCircle, ExternalLink, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';

interface WalletConnectionProps {
  onComplete: () => void;
  connected?: boolean;
}

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Most popular Ethereum wallet',
    icon: '🦊',
    supported: true,
    features: ['Ethereum', 'Polygon', 'BSC']
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connect any mobile wallet',
    icon: '🔗',
    supported: true,
    features: ['Multi-chain', 'Mobile friendly']
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Secure and user-friendly',
    icon: '🔵',
    supported: true,
    features: ['Ethereum', 'DeFi ready']
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Solana ecosystem wallet',
    icon: '👻',
    supported: false,
    features: ['Solana', 'NFTs']
  }
];

export function WalletConnection({ onComplete, connected }: WalletConnectionProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const handleWalletConnect = async (walletId: string) => {
    setSelectedWallet(walletId);
    setIsConnecting(true);

    // Simulate wallet connection
    setTimeout(() => {
      setConnectedAddress('0x742d35Cc6635C0532925a3b8D8C6d8b18F6C96ea');
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectedAddress(null);
    setSelectedWallet(null);
  };

  const copyAddress = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
    }
  };

  if (connected || connectedAddress) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl mb-2">Wallet Connected</h2>
            <p className="text-muted-foreground">
              Your wallet is ready for carbon credit transactions
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connected Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🦊</div>
                <div className="flex-1">
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-muted-foreground">Ethereum Mainnet</p>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Wallet Address</p>
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm font-mono">
                  <span className="flex-1 truncate">{connectedAddress}</span>
                  <Button size="sm" variant="ghost" onClick={copyAddress}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Network</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Ethereum Mainnet</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDisconnect} className="flex-1">
              Disconnect
            </Button>
            <Button onClick={onComplete} className="flex-1">
              Continue Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground text-sm">
            Connect a cryptocurrency wallet to receive carbon credit tokens and payments
          </p>
        </div>

        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your wallet will be used for receiving carbon credit NFTs and payments. We never store your private keys.
          </AlertDescription>
        </Alert>

        <div className="space-y-3 mb-6">
          {walletOptions.map((wallet) => (
            <Card 
              key={wallet.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !wallet.supported ? 'opacity-50' : ''
              } ${selectedWallet === wallet.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => wallet.supported && handleWalletConnect(wallet.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{wallet.name}</p>
                      {!wallet.supported && (
                        <Badge variant="secondary" className="text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{wallet.description}</p>
                    <div className="flex gap-1 mt-1">
                      {wallet.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedWallet === wallet.id && isConnecting && (
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">Why do I need a wallet?</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Receive carbon credit NFTs</li>
            <li>• Get paid for verified projects</li>
            <li>• Participate in carbon marketplaces</li>
            <li>• Maintain ownership of digital assets</li>
          </ul>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>Learn more about crypto wallets</span>
          </div>
        </div>
      </div>
    </div>
  );
}