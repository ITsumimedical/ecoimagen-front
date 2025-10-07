<template>
  <div>
    <v-row dense>
      <v-col cols="12" sm="12" md="12">
        <v-alert dense text border="left" icon="mdi-calendar-search" type="info">
          Proceso de asignación de cita
        </v-alert>
        <v-row dense>
          <v-col cols="12" md="6" sm="12">
            <v-autocomplete outlined dense label="Especialidad" v-model="formGenerarCita.especialidad" :items="especialidades"
              :loading="loading" no-data-text="No hay resultados" return-object item-text="nombre"
              @change="onEspecialidadChange"></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" sm="12">
            <v-autocomplete outlined dense label="Cita" v-model="formGenerarCita.cita" return-object :items="citas"
              no-data-text="Debe seleccionar una especialidad"
              :item-text="citas => `${citas.nombre} - ${citas.tiempo_consulta} Min -  ${(parseInt(citas.tipo_cita_id) === 2 ? 'Grupal' : 'Individual')}`"
              :loading="loading" @change="onCitaChange"></v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" sm="12">
            <v-autocomplete  :loading="cargando" outlined dense label="Sede" v-model="formGenerarCita.sede" :items="sedes"
              no-data-text="Debe seleccionar una una cita" return-object item-text="nombre" @change="onSedeChange">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="6" sm="6">

            <!-- <v-text-field outlined dense type="date" label="Fecha Solicitada" v-model="formGenerarCita.fecha_solicitada">
            </v-text-field> -->
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="auto">
              <template v-slot:activator="{on,attrs}">
                <v-text-field readonly outlined dense append-icon="mdi-calendar" label="Fecha Solicitada"
                  v-model="formGenerarCita.fecha_solicitada" v-bind="attrs" v-on="on">
                </v-text-field>
              </template>
              <v-date-picker v-model="formGenerarCita.fecha_solicitada" @input="menu=false"></v-date-picker>
            </v-menu>

          </v-col>
          <v-col cols="12" md="12" sm=12>
            <v-date-picker outlined v-if="formGenerarCita.sede" event-color="green lighten-1" v-model="formGenerarCita.fecha"
              :events="eventos" :min="fechaMinima" locale="es-es" full-width @change="onFechaChange"></v-date-picker>
          </v-col>
          <v-col cols="12" md="12" sm=12>

          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-autocomplete  :loading="cargarMedico" outlined dense label="Médico" v-model="formGenerarCita.medico" :items="medicos"
              no-data-text="Debe elegir una fecha disponible" return-object item-text="nombre" @change="onMedicoChange">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-textarea  filled dense auto-grow label="Observaciones" v-model="formGenerarCita.observacion"></v-textarea>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-data-table dense :headers="headersAgendasDisponibles" :items="agendas">
              <template v-slot:[`item.horario`]="{ item }">
                {{ item.fecha_inicio?.substring(11, 20) }}
              </template>
              <template v-slot:[`item.disponibilidad`]="{ item }">
                {{ item.consultas.filter(consulta => consulta.estado_id !== 5).length }} /
                {{ item.cita.cantidad_paciente }}
              </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="teal" small class="mr-2" v-bind="attrs" v-on="on" @click="verificarInfo(item)">
                      mdi-account-check
                    </v-icon>
                  </template>
                  <span>Agendar Cita</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>

      <v-dialog persistent v-if="dialogAsignarCita" v-model="dialogAsignarCita" max-width="600px" scrollable>
        <v-card>
          <v-alert dense text border="left" icon="mdi-clipboard-text" type="info" color="info">
            <b>Asignar Cita</b>
          </v-alert>
          <v-card-text>
            <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <p
                  v-if="formGenerarCita.cita && formGenerarCita.agenda && formGenerarCita.sede && formGenerarCita.medico">
                  Asignar Cita de tipo <b>{{ formGenerarCita.cita.nombre }}</b> al Afiliado <b>{{ `${afiliado.primer_nombre || ''} ${afiliado.segundo_nombre || ''} ${afiliado.primer_apellido || ''} ${afiliado.segundo_apellido || ''}`.trim()}}</b>
                  identificado con <b>{{ afiliado.tipo_documento.nombre }}</b> N° <b>{{ afiliado.numero_documento }}</b>
                  el
                  día <b>{{ $moment(formGenerarCita.agenda.fecha_inicio?.substring(0, 10)).format("dddd, D MMMM YYYY")
                    }}</b> a las <b>{{ $moment(formGenerarCita.agenda.fecha_inicio).format("h:mm a") }}</b> en la Sede
                  <b>{{
                    formGenerarCita.sede.nombre }}</b>, <b>{{ formGenerarCita.agenda.consultorio.nombre }}</b> con el
                  Médico
                  <b>{{ formGenerarCita.medico.nombre }}</b>
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" small dark @click="asignarCita()" :loading="cargando" :disable="cargando">Asignar Cita</v-btn>
            <v-btn @click="dialogAsignarCita = false" color="error" small>Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>


<script>
import moment from 'moment';
moment.locale('es');

export default {

  props: ['afiliado', 'demanda', 'modulo'],
   data() {
    return {
      preload: false,
      loading: false,
      menu: false,
      cargarMedico: false,
      tiposDocumentos: [],
      cargando: false,
      datosBuscarAfiliado: {
        numero_documento: null,
        tipo_documento: null
      },
      datosBasicos: true,
      editar: true,
      contadorCitasPendientes: null,
      consultasPendientes: [],
      consultasAtendidas: [],
      formGenerarCita: {
        especialidad: null,
        cita: null,
        sede: null,
        fecha_solicitada: null,
        fecha: null,
        medico: null,
        observacion: null,
        agenda: null,
        paciente: this.afiliado,
        tipo_consulta_id:5
      },
      especialidades: [],
      citas: [],
      sedes: [],
      eventos: [],
      medicos: [],
      agendasDisponibles: [],
      agendas: [],
      fechaMinima: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substring(0, 10),
      headersAgendasDisponibles: [
        { text: 'Hora', value: 'horario', align: 'center' },
        { text: 'Consultorio', value: 'consultorio.nombre', align: 'center' },
        { text: 'Asignados/Disponibilidad', value: 'disponibilidad', align: 'center' },
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'center' },
      ],
      dialogAsignarCita: false,
    }
  },
  mounted() {
    this.listarEspecialidadesConCitas()
  },
  filters: {
    formatoFecha(fecha) {
      return moment(fecha).format("dddd, D MMMM, YYYY");
    },

    formatoHora(Hora_Inicio) {
      return moment(Hora_Inicio).format("hh:mm A");
    },
  },
  methods: {

    limpiarAfiliado() {
      this.datosBuscarAfiliado = {
        numero_documento: null,
        tipo_documento: null
      },
        this.afiliado = null,
        this.citas = [];
      this.sedes = [];
      this.formGenerarCita = {
        especialidad: null,
        cita: null,
        sede: null,
        fecha_solicitada: null,
        fecha: null,
        medico: null,
        observacion: null,
        agenda: null
      },
        this.agendasDisponibles = [];
      this.eventos = [];
      this.agendas = [];
      this.citas = [];
      this.medicos = [];
    },

    listarEspecialidadesConCitas() {
      this.loading = true;
      this.$axios.get('/especialidades/listarEspecialidadesConMedicos').then(res => {
        let todasEspecialidades = res.data;
        if (this.modulo === 'enfermeriaOncologia') {
          this.especialidades = todasEspecialidades.filter(especialidad => especialidad.nombre === 'Enfermeria Oncologica');
        } else {
          this.especialidades = todasEspecialidades;
        }
      }).catch(error => {
        this.$toast.error('Ocurrió un error al cargar las especialidades');
        console.log(error);
      }).finally(() => {
        this.loading = false;
      });
    },

    listarCitasEspecialidad() {
      const especialidadSeleccionada = this.formGenerarCita.especialidad?.id;
      const especialidad = this.especialidades.find(e => e.id === especialidadSeleccionada);
      this.citas = especialidad ? especialidad.citas : [];
      this.formGenerarCita.cita = null;
      this.formGenerarCita.sede = null;
      this.sedes = [];
    },

    listarSedes() {
      const citaSeleccionada = this.formGenerarCita.cita?.id;
      if (citaSeleccionada) {
        this.cargando = true;
        this.$axios.post('/agenda/sede', { cita: citaSeleccionada }).then(res => {
          this.sedes = res.data;
        }).catch(error => {
          this.$toast.error('Ocurrió un error al cargar las sedes');
          console.log(error);
        }).finally(() => {
          this.cargando = false;
        });
      } else {
        this.sedes = [];
      }
      this.formGenerarCita.sede = null;
    },

    listarAgendaDisponible() {
      this.preload = true
      this.$axios.get(`/agenda/agendaDisponible?cita=${this.formGenerarCita.cita?.id}&sede=${this.formGenerarCita.sede?.id}`).then(res => {
        this.agendasDisponibles = res.data;
        res.data.forEach(agenda => {
          const found = this.eventos.find(elemento => elemento === agenda.fecha_inicio?.substring(0, 10));
          if (found === undefined) {
            this.eventos.push(agenda.fecha_inicio?.substring(0, 10));
          }
        })
      }).catch(error => {
        this.$toast.error('Ocurrio un error al cargar las sedes')
        console.log(error)
      }).finally(() => {
        this.preload = false
      })
    },

    listarMedicosPorAgenda() {
      this.cargarMedico = true;
      this.$axios.post('/agenda/medicos', {
        cita: this.formGenerarCita.cita?.id,
        fecha: this.formGenerarCita.fecha,
        sede: this.formGenerarCita.sede
      }).then(res => {
        res.data.forEach(agenda => {
          agenda.medicos.forEach(medico => {
            const id = this.medicos.findIndex(agenda => parseInt(agenda.id) === parseInt(medico.id));
            if (id < 0) {
              this.medicos.push({
                id: medico.id,
                nombre: `${medico.operador?.nombre || ''} ${medico.operador?.apellido || ''}`.trim(),
                agendas: [agenda]
              })
            } else {
              this.medicos[id].agendas.push(agenda)
            }
          })
        })
      }).catch(error => {
        this.$toast.error('Error al cargar los médicos')
        console.log(error)
      }).finally(() => {
        this.cargarMedico = false
      })
    },

    onEspecialidadChange() {
      this.citas = [];
      this.sedes = [];
      this.eventos = [];
      this.medicos = [];
      this.agendasDisponibles = [];
      this.agendas = [];
      this.listarCitasEspecialidad();
    },

    onCitaChange() {
      this.sedes = [];
      this.medicos = [];
      this.eventos = [];
      this.agendas = [];
      this.agendasDisponibles = [];
      this.listarSedes();
    },

    onSedeChange() {
      this.eventos = [];
      this.medicos = [];
      this.agendasDisponibles = [];
      this.agendas = [];
      this.listarAgendaDisponible();
    },

    onFechaChange() {
      this.medicos = [];
      this.agendas = [];
      this.agendasDisponibles = [];
      this.listarMedicosPorAgenda();
    },

    onMedicoChange() {
      this.agendas = [];
      const medicoSeleccionado = this.formGenerarCita.medico?.id;
      const medico = this.medicos.find(m => m.id === medicoSeleccionado);
      this.agendas = medico ? medico.agendas : [];
    },

    verificarInfo(item) {
      if (!this.formGenerarCita.fecha_solicitada) {
        this.$toast.error('Debe seleccionar una Fecha Solicitada')
        return
      }
     const consultasValidas = item.consultas.filter(consulta => consulta.estado_id !== 5);
      if (consultasValidas.length >= item.cita.cantidad_paciente) {
        this.$toast.error('La agenda ya tiene una consulta asignada a esa hora.');
        return;
      }
      this.formGenerarCita.agenda = item
      this.dialogAsignarCita = true
    },

    asignarCita() {
    this.cargando = true;

    this.$axios.post('/consultas/crear-cita-demanda', this.formGenerarCita).then(res => {
    if (res.data.mensaje === 'Cita asignada al afiliado con exito!') {
      this.$toast.success(res.data.mensaje);;
      if (this.modulo == 'demandaInducida') {
        this.$axios.post('demanda-inducidas/asignarCita', {
          id: this.demanda.id,
          consulta_id: res.data.id

        }).then(response => {
          this.$emit('listarDemandas');
          this.$toast.success(response.data.mensaje);
          this.limpiarCita();
        }).catch(error => {
          this.$swal({
            type: "error",
            title: "¡No puede ser!",
            text: error.response?.data?.mensaje || "Ocurrió un error al asignar la cita.",
          });
        });
      }

    } else {
      this.$swal({
        type: "error",
        title: "¡No es posible asignar esa cita!",
        text: res.data.mensaje
      });

    }
    }).catch(error => {
    this.$swal({
      type: "error",
      title: "¡No puede ser!",
      text: error.response?.data?.mensaje || "Ocurrió un error al asignar la cita.",
    });
    }).finally(() => {
    this.dialogAsignarCita = false;
    this.cargando = false;
    });
  },

    limpiarCita() {
      this.formGenerarCita = {
        especialidad: null,
        cita: null,
        sede: null,
        fecha_solicitada: null,
        fecha: null,
        medico: null,
        observacion: null,
        agenda: null,
        paciente: this.afiliado
      };
      this.citas = [];
      this.sedes = [];
      this.eventos = [];
      this.medicos = [];
      this.agendasDisponibles = [];
      this.agendas = [];
    }

  }
}
</script>
