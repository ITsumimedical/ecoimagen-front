<template>
  <div>
    <v-card>
      <v-card-text>
        <!-- seleccionar taquilla -->
        <v-row justify="center">
          <v-col cols="3" md="auto">
            <v-card-title>Seleccione el area y taquilla de trabajo:</v-card-title>
          </v-col>
          <v-col cols="3" md="auto">
            <v-autocomplete @change="getTurnos(),getTaquillas()" v-model="filtro.area_clinica_id" :items="areas"
              item-text="nombre" item-value="id" label="Area" rounded solo></v-autocomplete>
          </v-col>
          <v-col cols="3" md="auto">
            <v-autocomplete rounded solo v-model="taquilla" label="Seleccione su taquilla" :items="taquillas"
              item-text="nombre" item-value="id"></v-autocomplete>
          </v-col>
        </v-row>
        <!-- filtros -->
        <v-row justify="center">
          <v-col cols="6" md="auto">
            <v-autocomplete @change="getTurnos()" v-model="filtro.tipo_turno_id" :items="tipo_turnos" item-text="nombre"
              item-value="id" label="Tipo de turno" rounded solo></v-autocomplete>
          </v-col>
          <v-col cols="6" md="auto">
            <v-autocomplete @change="getTurnos()" v-model="filtro.estado_id" :items="filtroEstados" item-text="nombre"
              item-value="id" label="Estado" rounded solo></v-autocomplete>
          </v-col>
          <v-col cols="6" md="auto">
            <v-btn color="error" dark @click="limpiarFiltros()">Limpiar</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- tabla de turnos -->
      <div>
        <v-data-table :headers="listaTurnos" :items="turnos" item-key="turno.id" :loading="loading"
          loading-text="Cargando..." hide-default-footer>
          <template v-slot:[`item.id`]="{ item }">{{ item.id }}
          </template>
          <template v-slot:[`item.nombre_completo`]="{ item }">{{ item.nombre_completo ?? 'Sin Nombre' }}
          </template>
          <template v-slot:[`item.tipo_turno.nombre`]="{ item }">
            <v-chip :color="getColor(item.tipo_turno.color)" dark>{{ item.tipo_turno.nombre }}</v-chip>
          </template>
          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado.id)" dark>{{ item.estado.nombre}}</v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn v-if="item.estado.id != 31" fab small color="warning">
              <v-icon @click="cambiarEstado(item)">
                mdi-arrow-left-right
              </v-icon>
            </v-btn>
          </template>
          <template v-slot:no-data>
            No hay información para mostrar
          </template>
        </v-data-table>

        <!-- paginacion -->
        <template>
          <div class="text-center">
            <v-pagination v-model="paginacion.current" :length="paginacion.total" @input="getTurnos()" circle>
            </v-pagination>
          </div>
        </template>
      </div>

      <!-- Dialogo para llamar a la taquilla -->
      <v-dialog v-model="modal.estado" width="40%">
        <v-card>
          <v-card-title class="background: card white--text">Llamar a el turno #{{ form_cambiar_estado.turno_index }}
          </v-card-title>
          <v-divider></v-divider>
          <v-divider></v-divider>
          <v-card-text>
            <p>Actualmente tiene el estado de <span
                class="font-weight-black text-capitalize">{{ form_cambiar_estado.estado_actual }}</span>.</p>
            <form @submit.prevent="submitCambiarEstado">
              <v-autocomplete v-model="form_cambiar_estado.nuevo_estado_id" :items="filtroEstados" label="Nueva Estado"
                item-text="nombre" item-value="id" solo></v-autocomplete>
              <v-btn type="submit" dark color="boton" class="mr-3">Guardar</v-btn>
              <v-btn color="red" dark @click="getTurnos(),modal.estado = false">Cerrar</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
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
    name: "TurnoLista",
    data() {
      return {
        loading: false,
        taquilla: null,
        taquillas: [],
        turnos: [],
        estados: [],
        tipo_turnos: [],
        areas: [],
        filtro: {
          area_clinica_id: '',
          tipo_turno_id: '',
          estado_id: ''
        },
        form_cambiar_estado: {
          turno_index: null,
          turno_id: null,
          estado_actual: null,
          nuevo_estado_id: null
        },
        form_llamado: {
          taquilla_id: null,
          turno_id: null
        },
        paginacion: {
          current: 1,
          total: 0
        },
        modal: {
          estado: false,
          llamado: false
        },
        listaTurnos: [{
            text: "#",
            value: "id"
          },
          {
            text: "Nombre",
            value: "nombre_completo"
          },
          {
            text: "Documento",
            value: "numero_documento"
          },
          {
            text: "Tipo",
            value: "tipo_turno.nombre"
          },
          {
            text: "Area",
            value: "area.nombre"
          },
          {
            text: "Estado",
            value: "estado"
          },
          {
            text: "Fecha",
            value: "created_at"
          },
          {
            text: "Acciones",
            value: "actions"
          },
        ]
      }
    },

    mounted() {
      this.getEstados();
      this.getTipoTurnos();
      this.getAreas();
    },

    computed: {
      filtroEstados() {
        return this.estados.filter((item => item.id != 31)).map((estados) => {
          return {
            id: estados.id,
            nombre: `${estados.nombre}`
          }
        })
      },
    },

      methods: {
        async getTaquillas() {
          try {
            const response = await this.$axios.get(
              `/taquilla?page=1&area_clinica_id=${this.filtro.area_clinica_id}`
            );
            this.taquillas = response.data
          } catch (error) {
            this.$toast.error('No se ha podido cargar los datos');
          }
        },

        async getTurnos() {
          try {
            const response = await this.$axios.get(
              `/turno?page=${this.paginacion.current}&tipo_turno_id=${this.filtro.tipo_turno_id}&estado_id=${this.filtro.estado_id}&area_clinica_id=${this.filtro.area_clinica_id}`
            );
            this.paginacion.current = response.data.current_page
            this.paginacion.total = response.data.last_page
            this.turnos = response.data.data
          } catch (error) {
            console.log(error.response)
            console.log(error)
          }
        },

        async getEstados() {
          try {
            const response = await this.$axios.get('/estado?tipo_estado=turno')
            this.estados = response.data
          } catch (error) {

          }
        },

        async getTipoTurnos() {
          try {
            const response = await this.$axios.get('/tipo-turno')
            this.tipo_turnos = response.data
          } catch (error) {

          }
        },

        async getAreas() {
          try {
            const response = await this.$axios.get('/area-clinica')
            this.areas = response.data
          } catch (error) {
            console.log(error)
          }
        },

        async submitCambiarEstado() {
          try {
            /** Validamos que el campo no este null */
            if (!this.form_cambiar_estado.nuevo_estado_id) {
              this.$toast.error('Debe seleccionar un estada del turno');
            }
            if (!this.taquilla) {
              this.$toast.error('Debe seleccionar una taquilla');
            }
            const request = {
              'estado_id': this.form_cambiar_estado.nuevo_estado_id,
              'taquilla_id': this.taquilla
            }
            await this.$axios.put('/turno/cambiar-estado/' + this.form_cambiar_estado.turno_id, request);
            this.getTurnos()
            this.limpiarCambiarEstado()
          } catch (error) {
            console.log(error.response)
          }
        },

        cambiarEstado(turno, index) {
          this.modal.estado = true
          this.form_cambiar_estado.turno_index = index
          this.form_cambiar_estado.turno_id = turno.id
          this.form_cambiar_estado.estado_actual = turno.estado.nombre
        },

        limpiarCambiarEstado() {
          this.modal.estado = false
          this.form_cambiar_estado.turno_index = null
          this.form_cambiar_estado.turno_id = null
          this.form_cambiar_estado.estado_actual = null
          this.form_cambiar_estado.nuevo_estado_id = null
        },

        limpiarFiltros() {
          this.filtro.area_clinica_id = ''
          this.filtro.tipo_turno_id = ''
          this.filtro.estado_id = ''
          this.taquilla = ''
          this.getTurnos()
        },

        getColor(tipo) {
          if (tipo == 27) return 'error'
          else if (tipo == 28) return 'purple'
          else if (tipo == 29) return 'blue'
          else if (tipo == 30) return 'black'
          else if (tipo == 31) return 'boton'
          else if (tipo == 32) return 'warning'
          else if (tipo == 33) return 'brown'
          else return 'warning'
        },

      }
    }

</script>
