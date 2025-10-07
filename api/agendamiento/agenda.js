const slugGlobal = '/agenda'

const guardarAgenda = () => `${slugGlobal}`
const agendaDisponible = (cita,sede) => `${slugGlobal}/agendaDisponible?cita=${cita}&sede=${sede}`

export {
  guardarAgenda,
  agendaDisponible
}
