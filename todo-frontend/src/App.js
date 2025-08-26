import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/task";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
     setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await axios.post(API_URL, 
      { title: newTask }, 
      { headers: { "Content-Type": "application/json" } }
    );
    setNewTask("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await axios.put(`${API_URL}/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">Lista de afazeres</h2>
            </div>
            <div className="card-body">
              <div className="d-flex mb-4">
                <input
                  type="text"
                  className="form-control me-2"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite uma nova tarefa..."
                  disabled={isLoading}
                />
                <button 
                  className="btn btn-primary"
                  onClick={addTask}
                  disabled={isLoading || !newTask.trim()}
                >
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                  ) : (
                    "Adicionar"
                  )}
                </button>
              </div>

              {isLoading && tasks.length === 0 ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-inbox display-4 d-block mb-2"></i>
                  <p>Nenhuma tarefa encontrada. Adicione uma nova tarefa!</p>
                </div>
              ) : (
                <ul className="list-group">
                  {tasks.map((task) => (
                    <li 
                      key={task.id} 
                      className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`}
                    >
                      <div 
                        className="flex-grow-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleTask(task.id, task.completed)}
                      >
                        <span
                          style={{
                            textDecoration: task.completed ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </span>
                      </div>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteTask(task.id)}
                        disabled={isLoading}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-muted text-center">
              {tasks.length > 0 && (
                <small>
                  {tasks.filter(t => t.completed).length} de {tasks.length} tarefas concluídas
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
