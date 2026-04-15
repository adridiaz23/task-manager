# Guía técnica del código

Este documento explica las decisiones de implementación del proyecto.
Está pensado para entender el código sin necesidad de leerlo todo de golpe.

---

## App.jsx — el cerebro de la aplicación

`App.jsx` es el único componente que tiene estado "global" (el que afecta
a toda la app). Contiene tres bloques bien diferenciados:

### Bloque 1: declaración de estado

```jsx
const [tasks,   setTasks]   = useState([])
const [filter,  setFilter]  = useState('all')
const [darkMode, setDarkMode] = useState(() =>
  localStorage.getItem('theme') === 'dark'
)
```

`tasks` es el array de objetos. Cada tarea tiene esta forma:

```js
{
  id:        1700000000000,  // Date.now() — único y ordenable por creación
  text:      "Comprar leche",
  completed: false,
  priority:  "medium"        // 'high' | 'medium' | 'low'
}
```

### Bloque 2: sincronización con localStorage

```jsx
// Al montar: carga tareas guardadas
useEffect(() => {
  const saved = localStorage.getItem('tasks')
  if (saved) setTasks(JSON.parse(saved))
}, [])  // [] = solo se ejecuta una vez, al montar

// Cada vez que tasks cambia: guarda en localStorage
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}, [tasks])  // [tasks] = se ejecuta cuando tasks cambia
```

Por qué dos `useEffect` separados y no uno: porque tienen responsabilidades
distintas. El primero es de lectura (solo al montar). El segundo es de
escritura (cada vez que hay cambios). Mezclarlos en uno haría el código más
difícil de razonar.

### Bloque 3: funciones de mutación

Todas siguen el mismo patrón: **nunca mutar el array directamente**,
siempre crear uno nuevo.

```jsx
// MAL — mutación directa (React no detectaría el cambio)
tasks.push(newTask)
setTasks(tasks)

// BIEN — array nuevo con spread operator
setTasks([...tasks, newTask])
```

`editTask` y `toggleTask` usan `map()` que siempre devuelve un array nuevo:

```jsx
const toggleTask = (id) =>
  setTasks(tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }  // copia con cambio
      : task                                       // sin cambios
  ))
```

### Bloque 4: datos derivados (sin useState)

```jsx
const filteredTasks  = tasks.filter(t => ...)
const pendingCount   = tasks.filter(t => !t.completed).length
```

Estas variables se recalculan en cada render. No son estado porque
dependen directamente de `tasks` y `filter`. Convertirlas en `useState`
crearía el riesgo de que `filteredTasks` y `tasks` estén desfasados.

---

## TaskForm.jsx — formulario controlado con validación

Un **componente controlado** es aquel donde React controla el valor
del input en todo momento a través del estado:

```jsx
const [inputValue, setInputValue] = useState('')

<input
  value={inputValue}              // React dicta el valor
  onChange={e => setInputValue(e.target.value)}  // React actualiza al escribir
/>
```

Sin esto (`value` sin `onChange`) tendríamos un input de solo lectura.
Sin `value` en absoluto, React no controla el input y no podemos
limparlo programáticamente después de añadir una tarea.

### Por qué el error limpia al escribir

```jsx
const handleChange = (e) => {
  setInputValue(e.target.value)
  if (error) setError('')   // limpia solo si hay error activo
}
```

Es mejor UX limpiar el error en cuanto el usuario empieza a corregir,
no esperar a que haga submit de nuevo.

---

## TaskItem.jsx — estado local y edición inline

### Por qué isEditing vive aquí y no en App

La regla es: el estado debe vivir en el componente más cercano que
lo necesite. `App` no necesita saber qué tarea está siendo editada
en este momento. Solo `TaskItem` lo necesita.

Si `isEditing` viviera en `App`, tendríamos que pasar un `editingId`
y una función `setEditingId` por props por todos los niveles. Eso se
llama **prop drilling** y es un antipatrón a evitar.

### Sincronización de editValue al entrar en modo edición

```jsx
onDoubleClick={() => {
  setEditValue(task.text)  // ← importante: sincroniza con el valor actual
  setIsEditing(true)
}}
```

Sin la línea `setEditValue(task.text)`, si el usuario editó antes y
canceló, el input mostraría el texto a medio editar del intento anterior.

### Cancelar con Escape restaura el texto original

```jsx
if (e.key === 'Escape') {
  setEditValue(task.text)  // restaura
  setIsEditing(false)
}
```

Importante: restauramos a `task.text` (la prop que viene de App, que
no ha cambiado) y no a `editValue` (que el usuario puede haber
modificado). `task.text` es siempre la fuente de verdad.

### ciclar prioridades sin if/else

```jsx
const PRIORITY_ORDER = ['high', 'medium', 'low']

const cyclePriority = () => {
  const currentIndex = PRIORITY_ORDER.indexOf(task.priority)
  const nextIndex    = (currentIndex + 1) % PRIORITY_ORDER.length
  onPriorityChange(task.id, PRIORITY_ORDER[nextIndex])
}
```

El operador módulo `%` hace que al llegar al final del array
vuelva al principio automáticamente. Más limpio que un if/else encadenado.

---

## FilterBar.jsx — componente puramente presentacional

`FilterBar` no tiene estado propio ni lógica de negocio. Solo recibe
datos y dispara eventos hacia arriba. Este tipo de componente se llama
**presentational component** o **dumb component**.

```jsx
function FilterBar({ activeFilter, onFilterChange, totalCount, ... }) {
  // no hay useState aquí
  // no hay lógica de filtrado aquí
  // solo renderizado y propagación de clics
}
```

La lógica de qué tareas mostrar está en `App`. `FilterBar` solo
muestra los botones y avisa cuando el usuario hace clic en uno.
Esta separación hace que el componente sea muy fácil de probar
y de reutilizar.

---

## index.css — sistema de diseño con CSS custom properties

Las variables CSS (`:root { --color-primary: ... }`) permiten
implementar el modo oscuro sin JavaScript adicional:

```css
:root              { --color-bg: #f8fafc; }   /* tema claro */
[data-theme="dark"] { --color-bg: #0f172a; }   /* tema oscuro */
```

Cuando `App.jsx` ejecuta:
```js
document.documentElement.setAttribute('data-theme', 'dark')
```

El navegador cambia el selector activo y todos los elementos que usan
`var(--color-bg)` se actualizan instantáneamente en cascada, sin que
ningún componente hijo tenga que saber nada del tema.

La propiedad `transition` en `body` hace que el cambio sea suave
en lugar de un flash brusco:

```css
body {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

---

## Convención de commits usada en este proyecto

Este proyecto sigue [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Cuándo usarlo |
|---|---|
| `feat:` | Nueva funcionalidad para el usuario |
| `fix:` | Corrección de un bug |
| `style:` | Cambios de CSS, formato, sin lógica |
| `refactor:` | Reorganización de código sin cambiar comportamiento |
| `docs:` | Solo documentación |
| `chore:` | Configuración, dependencias, tareas auxiliares |

El cuerpo del commit (las líneas después del título) explica el **por qué**,
no el **qué**. El `diff` de Git ya muestra el qué.