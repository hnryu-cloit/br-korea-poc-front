type FeatureCardProps = {
  title: string;
  description: string;
  priority: string;
  acceptance: string;
};

export function FeatureCard({ title, description, priority, acceptance }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-meta">
        <span className="badge">{priority}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <small>{acceptance}</small>
    </article>
  );
}
