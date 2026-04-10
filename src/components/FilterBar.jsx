// FilterBar.jsx — barra de filtros con contadores
function FilterBar({ activeFilter, onFilterChange, totalCount, pendingCount, completedCount }) {

    // Definimos los filtros como array de objetos para evitar repetición
    // Este patrón (array de configuración) es muy habitual en código profesional
    const filters = [
      { id: 'all',       label: 'Todas',      count: totalCount     },
      { id: 'pending',   label: 'Pendientes', count: pendingCount   },
      { id: 'completed', label: 'Completadas', count: completedCount },
    ]
  
    return (
      <div className="filter-bar">
        {filters.map(f => (
          <button
            key={f.id}
            // La clase 'active' se añade solo al filtro seleccionado
            className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
            {/* Badge con el número de tareas */}
            <span className="filter-count">{f.count}</span>
          </button>
        ))}
      </div>
    )
  }
  
  export default FilterBar