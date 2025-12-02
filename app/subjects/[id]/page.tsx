type SubjectPageProps = {
  params: {
    id: string;
  };
};

export default function SubjectDetailPage({ params }: SubjectPageProps) {
  return (
    <main>
      <h1>Subject details</h1>
      <p>Subject ID: {params.id}</p>
      <p>Here you will see the subject information and its tasks.</p>
    </main>
  );
}
