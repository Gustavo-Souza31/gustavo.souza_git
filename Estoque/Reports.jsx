import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Reports({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Relatórios e análises do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios e Análises</CardTitle>
          <CardDescription>
            Esta funcionalidade será implementada na próxima fase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aqui você poderá acessar diversos relatórios:
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
            <li>Relatório de estoque</li>
            <li>Relatório de vendas por período</li>
            <li>Análise de lucro</li>
            <li>Produtos mais vendidos</li>
            <li>Relatórios exportáveis (PDF, Excel)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

