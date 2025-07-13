import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Leaf, Filter, Search, Star, 
  Crown, Flame, Clock, Users, Badge as BadgeIcon, ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface MarketplaceProps {
  userData: any;
}

const marketplaceListings = [
  {
    id: 1,
    title: 'Premium LDAR Methane Credits',
    type: 'carbon-avoidance',
    seller: 'EcoFlow Solutions',
    rating: 4.9,
    price: 12.50,
    quantity: 1000,
    location: 'Texas, USA',
    vintage: 2024,
    standard: 'VCS',
    isPremier: true,
    tags: ['LDAR', 'Methane', 'Premier'],
    description: 'High-quality methane prevention credits from leak detection and repair program',
    co2Equivalent: '80x impact factor'
  },
  {
    id: 2,
    title: 'Well P&A Abandonment Credits',
    type: 'carbon-avoidance',
    seller: 'Green Transition Co.',
    rating: 4.8,
    price: 15.00,
    quantity: 500,
    location: 'North Dakota, USA',
    vintage: 2024,
    standard: 'CAR',
    isPremier: true,
    tags: ['P&A', 'Plugging', 'Premier'],
    description: 'Methane prevention through proper well plugging and abandonment procedures',
    co2Equivalent: '80x impact factor'
  },
  {
    id: 3,
    title: 'Reforestation Credits',
    type: 'carbon-sequestration',
    seller: 'Forest Carbon Ltd.',
    rating: 4.7,
    price: 8.75,
    quantity: 2500,
    location: 'Oregon, USA',
    vintage: 2023,
    standard: 'VCS',
    isPremier: false,
    tags: ['Reforestation', 'Nature-based'],
    description: 'Carbon sequestration through native forest restoration',
    co2Equivalent: '1x direct capture'
  },
  {
    id: 4,
    title: 'Solar Farm Avoidance Credits',
    type: 'carbon-avoidance',
    seller: 'SunPower Renewable',
    rating: 4.6,
    price: 6.50,
    quantity: 5000,
    location: 'California, USA',
    vintage: 2024,
    standard: 'Gold Standard',
    isPremier: false,
    tags: ['Solar', 'Renewable'],
    description: 'Carbon avoidance through clean solar energy generation',
    co2Equivalent: 'Grid displacement'
  }
];

const buyerRequests = [
  {
    id: 1,
    buyer: 'Microsoft Corp.',
    type: 'carbon-avoidance',
    quantity: 10000,
    maxPrice: 14.00,
    vintage: 2024,
    location: 'North America',
    requirements: ['Premier projects preferred', 'Methane focus', 'VCS certified'],
    deadline: '15 days'
  },
  {
    id: 2,
    buyer: 'Amazon Sustainability',
    type: 'any',
    quantity: 25000,
    maxPrice: 10.00,
    vintage: '2023-2024',
    location: 'Global',
    requirements: ['Large volumes', 'Competitive pricing', 'Fast delivery'],
    deadline: '30 days'
  }
];

export function Marketplace({ userData }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('price-high');

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'carbon-avoidance':
        return { icon: Flame, color: 'text-orange-600' };
      case 'carbon-sequestration':
        return { icon: Leaf, color: 'text-blue-600' };
      default:
        return { icon: Leaf, color: 'text-green-600' };
    }
  };

  const filteredListings = marketplaceListings
    .filter(listing => 
      filterType === 'all' || listing.type === filterType
    )
    .filter(listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Carbon Credit Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell verified carbon credits</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </div>

      <Tabs defaultValue="buy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buy">Buy Credits</TabsTrigger>
          <TabsTrigger value="sell">Sell Credits</TabsTrigger>
          <TabsTrigger value="requests">Buyer Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search credits, sellers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="carbon-avoidance">Carbon Avoidance</SelectItem>
                <SelectItem value="carbon-sequestration">Carbon Sequestration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Premium Listings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Premier Methane Projects
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredListings
                .filter(listing => listing.isPremier)
                .map(listing => {
                  const projectDetails = getProjectIcon(listing.type);
                  const ProjectIcon = projectDetails.icon;
                  
                  return (
                    <Card key={listing.id} className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                <ProjectIcon className={`h-5 w-5 ${projectDetails.color}`} />
                              </div>
                              <Crown className="h-4 w-4 text-yellow-600 absolute -top-1 -right-1" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{listing.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <span>{listing.seller}</span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{listing.rating}</span>
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                            Premier
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{listing.description}</p>
                        
                        <div className="flex flex-wrap gap-1">
                          {listing.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold text-lg block">${listing.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Available:</span>
                            <span className="font-medium block">{listing.quantity.toLocaleString()} credits</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium block">{listing.location}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impact:</span>
                            <span className="font-medium text-orange-600 block">{listing.co2Equivalent}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Buy Now
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>

          {/* All Listings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">All Available Credits</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredListings
                .filter(listing => !listing.isPremier)
                .map(listing => {
                  const projectDetails = getProjectIcon(listing.type);
                  const ProjectIcon = projectDetails.icon;
                  
                  return (
                    <Card key={listing.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <ProjectIcon className={`h-4 w-4 ${projectDetails.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm truncate">{listing.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 text-xs">
                                <span className="truncate">{listing.seller}</span>
                                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                <span>{listing.rating}</span>
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold block">${listing.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Qty:</span>
                            <span className="font-medium block">{listing.quantity.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {listing.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button size="sm" className="w-full">
                          View & Buy
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sell" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>List Your Carbon Credits</CardTitle>
              <CardDescription>
                Create a listing to sell your verified carbon credits on the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to List Your Credits?</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your project verification to start selling carbon credits
                </p>
                <Button>
                  Start Listing Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Active Buyer Requests</h3>
            <div className="space-y-4">
              {buyerRequests.map(request => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{request.buyer}</CardTitle>
                        <CardDescription>
                          Looking for {request.quantity.toLocaleString()} credits • Max ${request.maxPrice}/credit
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{request.deadline}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize block">{request.type.replace('-', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vintage:</span>
                        <span className="font-medium block">{request.vintage}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium block">{request.location}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Value:</span>
                        <span className="font-medium block">${(request.quantity * request.maxPrice).toLocaleString()}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Requirements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        Submit Proposal
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}