export default async function CategoriaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1>Categoria {slug}</h1>
    </div>
  );
}
