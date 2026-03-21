import { useState } from 'react';

const ASSISTANT_URL = 'https://recrutamento-hml.idvlabs.com.br/';

export default function RecruitmentAssistant() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="flex h-[calc(100vh-73px)] flex-col bg-background p-4 md:p-6">
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/90 backdrop-blur-sm">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">Carregando assistente de recrutamento...</p>
          </div>
        )}

        <iframe
          title="Assistente de Recrutamento"
          src={ASSISTANT_URL}
          className="h-full min-h-[640px] w-full bg-background"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write; microphone"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}