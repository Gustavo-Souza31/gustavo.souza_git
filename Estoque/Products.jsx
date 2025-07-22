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
import { productsAPI, categoriesAPI, suppliersAPI } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Search,
  Tag,
  Building2
} from 'lucide-react'

export default function Products({ user }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    code: '',
    category_id: '',
    brand: '',
    unit_of_measure: '',
    supplier_id: '',
    purchase_cost: '',
    sale_price: '',
    minimum_stock: '',
    maximum_stock: ''
  })

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        suppliersAPI.getAll()
      ])
      
      setProducts(productsRes.data)
      setCategories(categoriesRes.data)
      setSuppliers(suppliersRes.data)
    } catch (error) {
      toast.error('Erro ao carregar dados')
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = {
        ...productForm,
        purchase_cost: parseFloat(productForm.purchase_cost),
        sale_price: parseFloat(productForm.sale_price),
        minimum_stock: parseInt(productForm.minimum_stock) || 0,
        maximum_stock: parseInt(productForm.maximum_stock) || 0,
        category_id: parseInt(productForm.category_id),
        supplier_id: parseInt(productForm.supplier_id)
      }

      if (selectedProduct) {
        await productsAPI.update(selectedProduct.id, formData)
        toast.success('Produto atualizado com sucesso!')
      } else {
        await productsAPI.create(formData)
        toast.success('Produto criado com sucesso!')
      }

      setIsProductDialogOpen(false)
      resetProductForm()
      fetchData()
    } catch (error) {
      toast.error('Erro ao salvar produto')
      console.error('Error saving product:', error)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      await categoriesAPI.create(categoryForm)
      toast.success('Categoria criada com sucesso!')
      setIsCategoryDialogOpen(false)
      setCategoryForm({ name: '', description: '' })
      fetchData()
    } catch (error) {
      toast.error('Erro ao criar categoria')
      console.error('Error creating category:', error)
    }
  }

  const handleSupplierSubmit = async (e) => {
    e.preventDefault()
    try {
      await suppliersAPI.create(supplierForm)
      toast.success('Fornecedor criado com sucesso!')
      setIsSupplierDialogOpen(false)
      setSupplierForm({ name: '', contact: '', phone: '', email: '', address: '' })
      fetchData()
    } catch (error) {
      toast.error('Erro ao criar fornecedor')
      console.error('Error creating supplier:', error)
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || '',
      code: product.code,
      category_id: product.category_id.toString(),
      brand: product.brand || '',
      unit_of_measure: product.unit_of_measure || '',
      supplier_id: product.supplier_id.toString(),
      purchase_cost: product.purchase_cost.toString(),
      sale_price: product.sale_price.toString(),
      minimum_stock: product.minimum_stock.toString(),
      maximum_stock: product.maximum_stock.toString()
    })
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productsAPI.delete(productId)
        toast.success('Produto excluído com sucesso!')
        fetchData()
      } catch (error) {
        toast.error('Erro ao excluir produto')
        console.error('Error deleting product:', error)
      }
    }
  }

  const resetProductForm = () => {
    setSelectedProduct(null)
    setProductForm({
      name: '',
      description: '',
      code: '',
      category_id: '',
      brand: '',
      unit_of_measure: '',
      supplier_id: '',
      purchase_cost: '',
      sale_price: '',
      minimum_stock: '',
      maximum_stock: ''
    })
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <p className="text-gray-600">Gerenciamento de produtos, categorias e fornecedores</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetProductForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
                  </DialogTitle>
                  <DialogDescription>
                    Preencha as informações do produto
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Código *</Label>
                      <Input
                        id="code"
                        value={productForm.code}
                        onChange={(e) => setProductForm({...productForm, code: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select value={productForm.category_id} onValueChange={(value) => setProductForm({...productForm, category_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="supplier">Fornecedor *</Label>
                      <Select value={productForm.supplier_id} onValueChange={(value) => setProductForm({...productForm, supplier_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Marca</Label>
                      <Input
                        id="brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unidade de Medida</Label>
                      <Input
                        id="unit"
                        value={productForm.unit_of_measure}
                        onChange={(e) => setProductForm({...productForm, unit_of_measure: e.target.value})}
                        placeholder="ex: unidade, kg, litro"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purchase_cost">Custo de Compra *</Label>
                      <Input
                        id="purchase_cost"
                        type="number"
                        step="0.01"
                        value={productForm.purchase_cost}
                        onChange={(e) => setProductForm({...productForm, purchase_cost: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sale_price">Preço de Venda *</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        step="0.01"
                        value={productForm.sale_price}
                        onChange={(e) => setProductForm({...productForm, sale_price: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min_stock">Estoque Mínimo</Label>
                      <Input
                        id="min_stock"
                        type="number"
                        value={productForm.minimum_stock}
                        onChange={(e) => setProductForm({...productForm, minimum_stock: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_stock">Estoque Máximo</Label>
                      <Input
                        id="max_stock"
                        type="number"
                        value={productForm.maximum_stock}
                        onChange={(e) => setProductForm({...productForm, maximum_stock: e.target.value})}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {selectedProduct ? 'Atualizar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Categoria: {product.category_name}</span>
                        <span>Fornecedor: {product.supplier_name}</span>
                        <span>Estoque: {product.current_stock}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm">
                        <span className="text-red-600">Custo: R$ {product.purchase_cost.toFixed(2)}</span>
                        <span className="text-green-600">Venda: R$ {product.sale_price.toFixed(2)}</span>
                        <span className="text-blue-600">Lucro: R$ {product.profit_margin.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Categorias</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Categoria</DialogTitle>
                  <DialogDescription>
                    Criar uma nova categoria de produtos
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="cat_name">Nome *</Label>
                    <Input
                      id="cat_name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cat_desc">Descrição</Label>
                    <Textarea
                      id="cat_desc"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Fornecedores</h2>
            <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Fornecedor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Fornecedor</DialogTitle>
                  <DialogDescription>
                    Cadastrar um novo fornecedor
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSupplierSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="sup_name">Nome *</Label>
                    <Input
                      id="sup_name"
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sup_contact">Contato</Label>
                    <Input
                      id="sup_contact"
                      value={supplierForm.contact}
                      onChange={(e) => setSupplierForm({...supplierForm, contact: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sup_phone">Telefone</Label>
                      <Input
                        id="sup_phone"
                        value={supplierForm.phone}
                        onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sup_email">Email</Label>
                      <Input
                        id="sup_email"
                        type="email"
                        value={supplierForm.email}
                        onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sup_address">Endereço</Label>
                    <Textarea
                      id="sup_address"
                      value={supplierForm.address}
                      onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSupplierDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Criar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-green-600" />
                        <h3 className="font-semibold">{supplier.name}</h3>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {supplier.contact && <p>Contato: {supplier.contact}</p>}
                        {supplier.phone && <p>Telefone: {supplier.phone}</p>}
                        {supplier.email && <p>Email: {supplier.email}</p>}
                        {supplier.address && <p>Endereço: {supplier.address}</p>}
                      </div>
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

