import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { stockAPI, productsAPI } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Package, 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Calendar,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react'

export default function Stock({ user }) {
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [stockReport, setStockReport] = useState(null)

  // Form state
  const [movementForm, setMovementForm] = useState({
    product_id: '',
    movement_type: '',
    quantity: '',
    reason: '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, movementsRes, reportRes] = await Promise.all([
        productsAPI.getAll(),
        stockAPI.getMovements(),
        stockAPI.getStockReport()
      ])
      
      setProducts(productsRes.data)
      setMovements(movementsRes.data)
      setStockReport(reportRes.data)
    } catch (error) {
      toast.error('Erro ao carregar dados de estoque')
      console.error('Error fetching stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMovementSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        ...movementForm,
        product_id: parseInt(movementForm.product_id),
        quantity: parseInt(movementForm.quantity)
      }

      await stockAPI.createMovement(formData)
      toast.success('Movimentação de estoque registrada com sucesso!')
      
      setIsMovementDialogOpen(false)
      resetMovementForm()
      fetchData()
    } catch (error) {
      toast.error('Erro ao registrar movimentação')
      console.error('Error creating movement:', error)
    }
  }

  const resetMovementForm = () => {
    setMovementForm({
      product_id: '',
      movement_type: '',
      quantity: '',
      reason: '',
      notes: ''
    })
  }

  const handleQuickMovement = async (productId, type, quantity) => {
    try {
      await stockAPI.createMovement({
        product_id: productId,
        movement_type: type,
        quantity: quantity,
        reason: type === 'entrada' ? 'Entrada rápida' : 'Saída rápida',
        notes: `Movimentação rápida via dashboard`
      })
      
      toast.success(`${type === 'entrada' ? 'Entrada' : 'Saída'} registrada com sucesso!`)
      fetchData()
    } catch (error) {
      toast.error('Erro ao registrar movimentação')
      console.error('Error creating quick movement:', error)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockProducts = products.filter(product => 
    product.current_stock <= product.minimum_stock
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Controle de Estoque</h1>
        <p className="text-gray-600">Movimentações de entrada e saída</p>
      </div>

      {/* Alertas de Estoque Baixo */}
      {lowStockProducts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{lowStockProducts.length} produto(s) com estoque baixo:</strong>
            <div className="mt-2 space-y-1">
              {lowStockProducts.slice(0, 3).map(product => (
                <div key={product.id} className="text-sm">
                  {product.name} - Estoque: {product.current_stock} (Mín: {product.minimum_stock})
                </div>
              ))}
              {lowStockProducts.length > 3 && (
                <div className="text-sm">E mais {lowStockProducts.length - 3} produto(s)...</div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Produtos</p>
                    <p className="text-2xl font-bold">{stockReport?.total_products || 0}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valor Total do Estoque</p>
                    <p className="text-2xl font-bold">R$ {stockReport?.total_stock_value?.toFixed(2) || '0,00'}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Produtos com Estoque Baixo</p>
                    <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Movimentações Hoje</p>
                    <p className="text-2xl font-bold">{stockReport?.movements_today || 0}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Produtos com Estoque Baixo */}
          {lowStockProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Produtos com Estoque Baixo</span>
                </CardTitle>
                <CardDescription>
                  Produtos que precisam de reposição urgente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          Estoque atual: {product.current_stock} | Mínimo: {product.minimum_stock}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleQuickMovement(product.id, 'entrada', 10)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          +10
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickMovement(product.id, 'entrada', 50)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          +50
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Movimentações de Estoque</h2>
            <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetMovementForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Movimentação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
                  <DialogDescription>
                    Registrar entrada ou saída de produtos
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMovementSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="product">Produto *</Label>
                    <Select value={movementForm.product_id} onValueChange={(value) => setMovementForm({...movementForm, product_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} - Estoque: {product.current_stock}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo de Movimentação *</Label>
                      <Select value={movementForm.movement_type} onValueChange={(value) => setMovementForm({...movementForm, movement_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantidade *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={movementForm.quantity}
                        onChange={(e) => setMovementForm({...movementForm, quantity: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Motivo *</Label>
                    <Input
                      id="reason"
                      value={movementForm.reason}
                      onChange={(e) => setMovementForm({...movementForm, reason: e.target.value})}
                      placeholder="Ex: Compra, Venda, Ajuste, Devolução"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={movementForm.notes}
                      onChange={(e) => setMovementForm({...movementForm, notes: e.target.value})}
                      placeholder="Informações adicionais sobre a movimentação"
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsMovementDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Registrar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {movements.slice(0, 20).map((movement) => (
              <Card key={movement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {movement.movement_type === 'entrada' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <h4 className="font-semibold">{movement.product_name}</h4>
                        <p className="text-sm text-gray-600">
                          {movement.movement_type === 'entrada' ? 'Entrada' : 'Saída'} de {movement.quantity} unidades
                        </p>
                        <p className="text-xs text-gray-500">
                          {movement.reason} • {formatDate(movement.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={movement.movement_type === 'entrada' ? 'default' : 'destructive'}>
                        {movement.movement_type === 'entrada' ? '+' : '-'}{movement.quantity}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        Por: {movement.user_name}
                      </p>
                    </div>
                  </div>
                  {movement.notes && (
                    <p className="text-sm text-gray-600 mt-2 pl-8">
                      Obs: {movement.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant="outline">{product.code}</Badge>
                        {product.current_stock <= product.minimum_stock && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Estoque Baixo
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Estoque Atual: <strong>{product.current_stock}</strong></span>
                        <span>Mínimo: {product.minimum_stock}</span>
                        <span>Máximo: {product.maximum_stock}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm">
                        <span className="text-green-600">
                          Valor em Estoque: R$ {(product.current_stock * product.purchase_cost).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickMovement(product.id, 'entrada', 1)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickMovement(product.id, 'saida', 1)}
                        className="text-red-600 hover:text-red-700"
                        disabled={product.current_stock <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

