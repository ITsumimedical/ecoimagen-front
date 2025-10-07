// plugins/inactivity.js
import Swal from "sweetalert2";

export default ({ store, redirect }) => {
  let warningTimer;
  let inactivityTimer;

  const resetInactivityTimer = () => {
    clearTimeout(warningTimer);
    clearTimeout(inactivityTimer);
    startInactivityTimer();
  };

  const startInactivityTimer = () => {
    // Temporizador para mostrar alerta a los 3 horas de inactividad
    warningTimer = setTimeout(() => {
      if (store.getters["auth/isAuthenticated"]) {
        Swal.fire({
          title: "Estás inactivo",
          text: "Has estado inactivo durante 3 horas. Serás desconectado en 1 hora si no realizas ninguna acción.",
          type: "warning",
          confirmButtonText: "Entendido",
        });
      }
    }, 10800000); // 3 horas

    // Temporizador para desconectar al usuario después de 30 minutos de inactividad
    inactivityTimer = setTimeout(() => {
      if (store.getters["auth/isAuthenticated"]) {
        Swal.fire({
          title: "Desconexión por inactividad",
          text: "Has sido desconectado debido a la inactividad.",
          type: "warning",
          confirmButtonText: "Aceptar",
        }).then(() => {
          store.dispatch("auth/logout").then(() => {
            redirect("/");
          });
        });
      }
    }, 14400000); // 4 horas
  };

  // Escucha eventos de usuario
  ["mousemove", "keydown", "click"].forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
  });

  // Iniciar el temporizador cuando el plugin se carga
  startInactivityTimer();
};
