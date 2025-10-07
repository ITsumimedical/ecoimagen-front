<template>
  <!-- Botonera superior -->
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <!-- Calendario -->
        <v-calendar locale="es" ref="calendar" v-model="focus" color="primary" :events="events"
          :event-color="getEventColor" :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
          @change="updateRange">
        </v-calendar>
        <v-dialog v-model="dialogoCreacionTurno" max-width="1000px">
          <v-container fluid class="pa-0">
            <v-card>
              <v-card-title class="titulo">
                <span class="white--text text-h5">Caracterización de horario laboral</span>
              </v-card-title>
              <v-subheader>Determina el horario a cumplir por el empleado</v-subheader>
              <form @submit.prevent="guardarTurno">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select dense :error-messages="errors.servicio_id" v-model="detalle.servicio_id"
                          :items="servicios" label="Servicio" item-text="nombre" item-value="id"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select dense :error-messages="errors.turno_id" v-model="detalle.turno_id" :items="turnos"
                          label="Turno" item-text="nombre" item-value="id"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select dense :error-messages="errors.etiqueta_id" v-model="detalle.etiqueta_id"
                          :items="etiquetas" label="Etiqueta" item-text="nombre" item-value="id"></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="close()">
                    Cerrar
                  </v-btn>
                  <v-btn color="boton" dark @click="guardarTurno()">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-container>
        </v-dialog>
        <!-- Abrir evento -->
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    data: () => ({
      detalle: {
        servicio_id: '',
        turno_id: '',
        etiqueta_id: '',
      },
      errors: {
        servicio_id: '',
        turno_id: '',
        etiqueta_id: '',
      },
      servicios: [],
      turnos: [],
      etiquetas: [],
      dialogoCreacionTurno: false,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['deep-purple', 'cyan', 'grey darken-1'],
      names: ['Turno 06:00 a 18:00', 'Turno 18:00 a 06:00'],
    }),
    mounted() {
      this.$refs.calendar.checkChange()
      this.listarServicios()
      this.listarTurnos()
      this.listarEtiquetas()
    },
    methods: {
      listarServicios() {
        this.$axios.get('/servicio-th/listar').then(res => {
          this.servicios = res.data.data;
        })
      },
      listarTurnos() {
        this.$axios.get('/turno-th/listar').then(res => {
          this.turnos = res.data.data;
        })
      },
      listarEtiquetas() {
        this.$axios.get('/etiqueta-th/listar').then(res => {
          this.etiquetas = res.data.data;
        })
      },
      guardarTurno() {
        console.log('guardando');
      },
      close() {
        this.dialogoCreacionTurno = false
      },
      viewDay({
        date
      }) {
        this.dialogoCreacionTurno = true
      },
      getEventColor(event) {
        return event.color
      },
      setToday() {
        this.focus = ''
      },
      prev() {
        this.$refs.calendar.prev()
      },
      next() {
        this.$refs.calendar.next()
      },
      showEvent({
        nativeEvent,
        event
      }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange({
        start,
        end
      }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 1) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
      },
      rnd(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }

</script>
