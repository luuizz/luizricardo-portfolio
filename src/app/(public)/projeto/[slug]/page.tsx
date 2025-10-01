export default async function DetalheProjetoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>Detalhes do Projeto {slug}</h1>
    </div>
  );
}
