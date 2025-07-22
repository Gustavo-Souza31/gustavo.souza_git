import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Sales({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <p className="text-gray-600">Registro e controle de vendas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sistema de Vendas</CardTitle>
          <CardDescription>
            Esta funcionalidade será implementada na próxima fase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aqui você poderá gerenciar todas as vendas do sistema:
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
            <li>Registro de vendas</li>
            <li>Cálculo automático de lucro</li>
            <li>Gestão de clientes</li>
            <li>Histórico de vendas</li>
            <li>Relatórios de faturamento</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

