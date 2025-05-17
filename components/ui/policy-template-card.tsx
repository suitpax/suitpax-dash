"use client"

import type { PolicyTemplate } from "@/types/policy"
import { Copy, ArrowRight } from "lucide-react"

interface PolicyTemplateCardProps {
  template: PolicyTemplate
  onUseTemplate: (template: PolicyTemplate) => void
}

export function PolicyTemplateCard({ template, onUseTemplate }: PolicyTemplateCardProps) {
  return (
    <div className="bg-black border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-medium">{template.name}</h3>
          <p className="text-white/70 text-sm">
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)} Template
          </p>
        </div>
        <div className="p-2 bg-white/5 rounded-lg">
          <Copy className="h-4 w-4 text-white/70" />
        </div>
      </div>

      <p className="text-white/70 text-sm mb-4">{template.description}</p>

      <div className="text-white/50 text-xs mb-3">{template.rules.length} pre-configured rules</div>

      <button
        onClick={() => onUseTemplate(template)}
        className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center transition-colors"
      >
        Use This Template
        <ArrowRight className="h-4 w-4 ml-2" />
      </button>
    </div>
  )
}
