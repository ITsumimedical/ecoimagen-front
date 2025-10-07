<template>
  <div>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
	  <v-alert text dense border="left" type="info" :icon="false" class="text-center"><b>GESTIÓN MESA DE AYUDA</b></v-alert>
      <v-col>
        <v-row class="mx-2">
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-text-field dense v-model="radicado_filtro" label="Radicado" outlined>
            </v-text-field>
          </v-col>
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-text-field dense v-model="area_filtro" label="Area" outlined>
            </v-text-field>
          </v-col>
          <v-col md="2" lg="2" xl="2" sm="2" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn small color="success" @click="ListarCasosMesaAyuda()">Filtrar</v-btn>
              <v-btn small class="ml-2" color="error" @click="limpiarFiltro()">Limpiar</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table :headers="headers" :items="casos" disable-pagination loading-text="Cargando..."
              hide-default-footer dense no-data-text="No hay datos para mostrar">
              <template v-slot:[`item.nombrePrioridad`]="{ item }">
                <v-chip small :color="colorPrioridad(item.nombrePrioridad)" dark>{{ item.nombrePrioridad }}</v-chip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <td>
                  <v-btn @click="Pendientes(item)" color="blue" icon small>
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-dialog v-model="dialogoPendientes" persistent width="1000">
          <v-card>
            <v-alert dense text border="left" type="info" icon="mdi-comment-eye-outline">Detalle de solicitud</v-alert>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field dense label="Radicado" v-model="usuario.id" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field dense label="Usuario" v-model="usuario.email" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field dense label="Área" v-model="usuario.area" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="3">
                  <v-text-field dense label="Prioridad" v-model="usuario.nombrePrioridad" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="12">
                  <v-text-field dense label="Asunto" v-model="usuario.asunto" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="12">
                  <v-textarea dense label="Descripción" v-model="usuario.descripcion" readonly auto-grow></v-textarea>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-btn small v-for="(data, index) in usuario.adjuntos_mesa_ayuda" :key="index" color="info" class="ml-2">
                    <v-icon left color="white">mdi-download</v-icon>
                    <a @click="imprimirAdjunto(data.ruta)" style="color:white">Adjunto {{index+1}}</a>
                  </v-btn>
                </v-col>
                <v-col md="12">
                  <v-alert dense text border="left" type="success" icon="mdi-book-cog-outline">Gestión de solicitud
                  </v-alert>
                </v-col>
                <v-col md="3">
                  <v-select dense label="Acciones" :items="RespuestaSolicitud" v-model="accionSeleccionada"
                    @change="manejarCambioAccion"></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="12" v-if="mostrarMotivo">
                  <v-textarea dense label="Motivo" auto-grow v-model="solucionar.respuesta"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" md="6" v-if="mostrarMotivo">
                  <v-file-input v-model="adjuntos" small-chips multiple outlined dense label="Adjuntar"
                    accept=".jpg, .jpeg, .png,.doc,.docx,.xml,.xls,.pdf">
                  </v-file-input>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-if="accionSeleccionada == 'Asignar'">
                  <v-autocomplete dense :items="categorias" item-text="nombre" return-object v-model="asignar.categoria"
                    label="Categoria">
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" small @click="limpiarDialogo()" dark>
                  Cerrar
                </v-btn>
                <v-btn color="success" small @click="SolucionarCaso()" dark v-if="accionSeleccionada === 'Solucionar'">
                  Solucionar
                </v-btn>
                <v-btn color="warning" small @click="AnularCaso()" dark v-if="accionSeleccionada === 'Anular'">
                  Anular
                </v-btn>
                <v-btn color="warning" small @click="asignarHelp()" dark v-if="accionSeleccionada === 'Asignar'">
                  Asignar
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-col>
          <v-row no-gutters style="background-color: white;">
            <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
              <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                @input="ListarCasosMesaAyuda()">
              </v-pagination>
            </v-col>
            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
              <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                @change="ListarCasosMesaAyuda()">
              </v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-card>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('mesaAyuda.gestion')) {
        return redirect('/');
      }
    },
    name: 'gestionMesaAyuda',

    data() {
      return {
        casos: [],
        pagina: 1,
        total: 0,
        radicado_filtro: '',
        dialogoPendientes: false,
        adjuntos_mesa_ayuda: [],
        adjuntos: [],
        area_filtro: '',
        opcionActual: 5,
        preload: false,
        accionSeleccionada: '',
        motivo: false,
        anular: false,
        fechaEstimada: '',
        opciones: [5, 10, 20, 50, 100],
        RespuestaSolicitud: ['Solucionar', 'Anular', 'Asignar'],
        solucionar: {
          respuesta: '',
          adjunto_id: ''
        },
        usuario: {
          id: '',
          email: '',
          area: '',
          nombrePrioridad: '',
          asunto: '',
          descripcion: '',
        },
        headers: [{
            text: ' # Radicado',
            value: 'id'
          },
          {
            text: 'Área',
            value: 'area'
          },
          {
            text: 'Categoría',
            value: 'categoria_mesa_ayuda.nombre'
          },
          {
            text: 'Prioridad',
            value: 'nombrePrioridad'
          },
          {
            text: 'Estado',
            value: 'nombreEstado'
          },
          {
            text: 'Fecha Creación',
            value: 'fechaCreacion'
          },
          {
            text: 'Acciones',
            value: 'actions'
          },

        ],
        categorias: [],
        asignar: {
          categoria: []
        }
      }
    },
    computed: {
      mostrarMotivo() {
        return this.accionSeleccionada === 'Solucionar' || this.accionSeleccionada === 'Anular';
      }
    },
    mounted() {
      this.ListarCasosMesaAyuda();
    },
    methods: {
      ListarCasosMesaAyuda() {
        this.preload = true;
        const params = {
          page: this.pagina,
          cantidad: this.opcionActual,
          radicado_filtro: this.radicado_filtro,
          area_filtro: this.area_filtro
        };
        this.$axios.get('/mesa-ayuda/listar', {
            params
          })
          .then(res => {
            this.casos = res.data.data;
            this.total = res.data.last_page;
            this.preload = false;
          })
          .catch(e => {
            console.error(e);
            this.preload = false;
          });
      },

      Pendientes(item) {
        this.fetchCategorias()
        this.dialogoPendientes = true,
          this.usuario = item
        this.asignar.categoria = item.categoria_mesa_ayuda

      },

      async imprimirAdjunto(ruta) {
        try {
          this.preload = true
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
          this.preload = false
        } catch (error) {
          this.preload = false,
            this.$toast.error('El adjunto de la factura no existe!')
          console.log(error.response);
        }
      },

      colorPrioridad(Prioridad) {
        switch (Prioridad) {
          case 'Alta':
            return 'red';
          case 'Media':
            return 'orange';
          case 'Baja':
            return 'green';
          default:
            return '';
        }
      },
      limpiarFiltro() {
        this.radicado_filtro = '',
          this.area_filtro = '',
          this.ListarCasosMesaAyuda()
      },
      manejarCambioAccion() {
        this.motivo = this.accionSeleccionada === 'Solucionar';
        this.anular = this.accionSeleccionada === 'anular';
      },
      limpiarDialogo() {
        this.dialogoPendientes = false;
        this.usuario = {
          id: '',
          email: '',
          area: '',
          nombrePrioridad: '',
          asunto: '',
          descripcion: '',
        };
        this.accionSeleccionada = '';
        this.motivo = false;
        this.anular = false;
        this.fechaEstimada = '';
        this.asignar.categoria = []
      },

      SolucionarCaso() {
        let formData = new FormData();
        formData.append(`respuesta`, this.solucionar.respuesta);
        for (let i = 0; i < this.adjuntos.length; i++) {
          formData.append(`adjuntos[]`, this.adjuntos[i]);
        }
        this.preload = true
        this.$axios.post(`/mesa-ayuda/solucionar/${this.usuario.id}`, formData)
          .then(response => {
            this.dialogoPendientes = false;
            this.ListarCasosMesaAyuda();
            this.$emit("updateCount");
            this.$toast.success('datos guardados exitosamente.');
            this.preload = false
          })
          .catch(error => {
            this.preload = false
          });
      },
      AnularCaso() {
        let formData = new FormData();
        formData.append(`respuesta`, this.solucionar.respuesta);
        for (let i = 0; i < this.adjuntos.length; i++) {
          formData.append(`adjuntos[]`, this.adjuntos[i]);
        }
        this.preload = true
        this.$axios.post(`/mesa-ayuda/anular/${this.usuario.id}`, formData)
          .then(response => {
            this.dialogoPendientes = false;
            this.ListarCasosMesaAyuda();
            this.$emit("updateCount");
            this.$toast.success('datos guardados exitosamente.');
            this.preload = false
          })
          .catch(error => {
            this.preload = false
          });
      },

      fetchCategorias() {
        this.preload = true
        this.$axios.get('/CategoriaMesaAyuda/listar').then(res => {
          this.preload = false
          this.categorias = res.data
        }).catch(error => {
          this.toast.error('No se encontro prioridades')
          this.preload = false
        })
      },

      asignarHelp() {
        if (this.asignar.categoria == undefined || this.asignar.categoria.length == 0) {
          this.$toast.error('Debe seleccionar un usuario.');
          return
        }
        this.preload = true

        const data = {
          'mesa_ayuda_id': this.usuario.id,
          'categoria': this.asignar.categoria
        }
        this.$axios.post('mesa-ayuda/asignar', data).then(res => {
          this.preload = false
          this.ListarCasosMesaAyuda();
          this.$toast.success('Se asigno con exito')
          this.limpiarDialogo()
        }).catch(e => {
          this.preload = false
          console.log(e);

        })
      },
    }

  }

</script>
