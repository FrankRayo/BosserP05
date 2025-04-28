type SidebarProps = {
  onHomeClick: () => void;
};

export default function Sidebar({ onHomeClick }: SidebarProps) {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-transparent text-dark p-4">
      <h2 className="text-2xl font-semibold mb-6">BosserP05</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={onHomeClick}
            className="text-dark hover:text-primary font-medium no-underline bg-transparent border-0 p-0 cursor-pointer"
          >
            🏠 Home
          </button>
        </li>
      </ul>
    </div>
  );
}
