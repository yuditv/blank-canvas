import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";

export function TermsPage() {
  const [activeTab, setActiveTab] = useState<"acordo" | "regras">("acordo");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="panel-glass border-primary/20">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Termos de serviço</h1>
              <p className="text-sm text-muted-foreground">
                Considera-se que você aceitou todas as regras ao usar nosso site.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "acordo" ? "default" : "outline"}
              onClick={() => setActiveTab("acordo")}
              className={activeTab === "acordo" ? "bg-primary" : ""}
            >
              Acordo de Associação
            </Button>
            <Button
              variant={activeTab === "regras" ? "default" : "outline"}
              onClick={() => setActiveTab("regras")}
            >
              Regras
            </Button>
          </div>

          <Card className="bg-card/60 border-border/60">
            <CardContent className="p-6 space-y-4">
              {activeTab === "acordo" && (
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <h3 className="text-base font-semibold text-foreground">Acordo de Associação</h3>
                  
                  <p>
                    Ao fazer um pedido em nosso painel, você aceita automaticamente todos os termos de serviço listados abaixo, independentemente de você lê-los ou não.
                  </p>

                  <p>
                    Reservamo-nos o direito de alterar estes Termos de Serviço sem aviso prévio. Espera-se que você leia todos os termos de serviço antes de fazer cada pedido para garantir que esteja atualizado com quaisquer alterações ou alterações futuras.
                  </p>

                  <p>
                    Você usará nosso site apenas de maneira que siga todos os acordos feitos com todos os sites de mídia social em suas páginas individuais de Termos de Serviço.
                  </p>

                  <p>
                    Nossas tarifas estão sujeitas a alterações a qualquer momento sem aviso prévio. Os termos permanecem em vigor no caso de alterações nas taxas.
                  </p>

                  <p>
                    Não garantimos prazo de entrega para nenhum serviço. Oferecemos nossa melhor estimativa de quando o pedido será entregue. Esta é apenas uma estimativa e não reembolsaremos pedidos que estão sendo processados se você achar que eles estão demorando muito.
                  </p>

                  <p>
                    Estamos nos esforçando para entregar exatamente o que nossos revendedores esperam de nós. Neste caso, reservamo-nos o direito de alterar um tipo de serviço se considerarmos necessário para concluir um pedido.
                  </p>
                </div>
              )}

              {activeTab === "regras" && (
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <h3 className="text-base font-semibold text-foreground">Regras</h3>

                  <p>
                    instaluxo.com não será responsável caso você enfrente uma perda na sua conta de mídia social devido à violação destas regras. Em caso de qualquer problema, as pessoas não podem reclamar e reivindicar direitos contra <strong>instaluxo.com</strong>. <strong>instaluxo.com</strong> reserva-se o direito de fazer alterações nestas regras.
                  </p>

                  <p>
                    • O perfil em questão deve ser tornado público antes de fazer um pedido. Se houver algum problema com os serviços recebidos para contas privadas, nenhum reembolso ou compensação será feito.
                  </p>

                  <p>
                    • Os sistemas de mídia social são constantemente atualizados e transações como seguidores e curtidas podem fazer com que sua conta seja encerrada. Não receba seguidores ou curtidas em contas de mídia social "Recém-abertas", "Violando direitos autorais" e "Não aprovadas por telefone e e-mail".
                  </p>

                  <p>
                    • Se serviços como seguidores e curtidas forem usados em contas comuns de mídia social, o risco de encerramento da conta é maior. Crie um pedido aceitando esta situação. instaluxo.com não aceita responsabilidade em caso de encerramento das referidas contas de mídia social ou qualquer outro evento adverso.
                  </p>

                  <p>
                    • Não insira nenhum pedido do instaluxo.com ou de qualquer outro provedor no mesmo link antes de o pedido ser concluído.
                  </p>

                  <p>
                    • instaluxo.com não oferece garantia sobre contas encerradas, seguidores excluídos e deficiências em todos os serviços em instaluxo.com.
                  </p>

                  <p>
                    • Não há garantia de que todos os serviços em instaluxo.com estejam ativos, travados ou não. instaluxo.com é o único responsável pela conclusão do serviço adquirido. Se o serviço aparecer como completo ou incompleto, a instalação ocorrerá no sistema antes de ser concluída. A taxa restante é refletida na sua conta como um saldo.
                  </p>

                  <p>
                    • Pelos serviços recebidos através de instaluxo.com, a pessoa que faz o pedido é responsável.
                  </p>

                  <p>
                    • Aguarde pelo menos 8 horas após a conclusão do pedido nas transações do Foreign Bot Twitter. Em seguida, faça um novo pedido.
                  </p>

                  <p>
                    • As transações dos seguidores do bot não são garantidas. Esses seguidores podem ser excluídos com manutenção nas plataformas de mídia social. Como a duração da manutenção não é certa, é possível excluir os seguidores recebidos em até 24 horas.
                  </p>

                  <p>
                    • O pedido realizado terá início após 48 horas no máximo.
                  </p>

                  <p>
                    • +18, conteúdo sexual, vendas de cupons iddaa, apostas, jogos de azar ilegais etc. O uso dos serviços do instaluxo.com é proibido para contas de mídia social que contenham conteúdo.
                  </p>

                  <p>
                    • O início dos pedidos feitos via instaluxo.com pode variar dependendo da densidade. Pode ficar na fila de acordo com a intensidade, pode atrasar, pode começar tarde.
                  </p>

                  <p>
                    • O saldo enviado para instaluxo.com não é reembolsável. Somente o saldo cobrado pela compra de um serviço específico é reembolsável devido à remoção desse serviço do instaluxo.com.
                  </p>

                  <p>
                    • Não torne as contas privadas, não altere o ID da conta ou altere as informações da conta após o pedido ser feito. Não faça pedidos de instaluxo.com ou de qualquer outro fornecedor antes que seu pedido seja concluído.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}