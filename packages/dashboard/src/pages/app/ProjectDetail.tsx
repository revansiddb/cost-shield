import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Project {id}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Detailed cost tracking and routing key management.</p>
      </div>
    </div>
  );
}
