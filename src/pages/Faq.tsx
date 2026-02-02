 import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
 } from "@/components/ui/accordion";
 import { Card, CardContent, CardHeader } from "@/components/ui/card";
 import { HelpCircle, ShoppingCart, Wallet, Clock, AlertCircle } from "lucide-react";
 
 const faqSections = [
   {
     title: "Status de Pedidos",
     icon: ShoppingCart,
     items: [
       {
         question:
           'Meu pedido está como "Em processamento", "Em progresso" ou "Pendente". O que significa?',
         answer:
           "Seu Pedido está na fila de execução. O tempo varia conforme informado na descrição do serviço! Você deve aguardar seu entregue.",
       },
       {
         question: "Posso cancelar um pedido após o Enviado?",
         answer:
           'Apenas se estiver como "Pendente" ou "Em processamento". Pedidos em andamento podem não ser cancelados. Você pode cancelar o pedido no Histórico de pedidos, caso tenha o botão de cancelar explicitamente informado na Descrição do Serviço!',
       },
     ],
   },
   {
     title: "Recargas e Saldo",
     icon: Wallet,
     items: [
       {
         question: "Quanto tempo demora para o saldo ser creditado após recarga?",
         answer:
           "Pix: até 30 min (geralmente instantâneo)\nCriptomoedas: até 30 min (geralmente instantâneo)",
       },
     ],
   },
   {
     title: "Prazos de Entrega",
     icon: Clock,
     items: [
       {
         question: "Os serviços têm prazos fixos?",
         answer:
           "Cada serviço contém um prazo estimado (24-48h). Varia conforme a estabilidade da rede social.",
       },
     ],
   },
   {
     title: "Acompanhamento",
     icon: AlertCircle,
     items: [
       {
         question: "Como acompanho meu pedido?",
         answer:
           'Acesse Meus Pedidos/Histórico de Pedidos e acompanhe o andamento do seu pedido. Status atualizados:\n✅ Concluído  🟡 Pendente  🔴 Cancelado',
       },
       {
         question: "Não recebi reembolso de um pedido falha. O que fazer?",
         answer:
           'Pedidos marcados como "Cancelado" têm estorno automático.',
       },
     ],
   },
 ];
 
 export function FaqPage() {
   return (
     <div className="mx-auto max-w-4xl space-y-6">
       <Card className="panel-glass border-primary/20">
         <CardHeader className="border-b border-border/60 pb-4">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
               <HelpCircle className="h-5 w-5 text-primary" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-gradient">Perguntas Frequentes</h1>
             </div>
           </div>
         </CardHeader>
       </Card>
 
       <div className="space-y-4">
         {faqSections.map((section, idx) => (
           <Card key={idx} className="panel-glass border-border/70">
             <CardHeader className="border-b border-border/60 pb-3">
               <div className="flex items-center gap-3">
                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                   <section.icon className="h-4 w-4 text-primary" />
                 </div>
                 <h2 className="text-base font-semibold text-primary">{section.title}</h2>
               </div>
             </CardHeader>
             <CardContent className="pt-4">
               <Accordion type="single" collapsible className="space-y-2">
                 {section.items.map((item, i) => (
                   <AccordionItem key={i} value={`${idx}-${i}`} className="border-b border-border/50">
                     <AccordionTrigger className="text-sm font-medium hover:text-primary">
                       {item.question}
                     </AccordionTrigger>
                     <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">
                       {item.answer}
                     </AccordionContent>
                   </AccordionItem>
                 ))}
               </Accordion>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
   );
 }