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
            <v-autocomplete dense v-model="sede_filtro" label="Sedes" outlined :items="sedes"></v-autocomplete>
          </v-col>
          <v-col md="3" lg="3" xl="3" sm="3s" cols>
            <v-text-field dense v-model="categoria" label="Categoria" outlined>
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
          <v-col cols="12" md="12" sm="12">
            <v-text-field label="Buscar" hint="Puedes buscar por cualquier campo" v-model="buscar"></v-text-field>
          </v-col>
          <v-col>
            <v-data-table :search="buscar" :headers="headers" :items="casos" disable-pagination loading-text="Cargando..."
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
                <v-col cols="12" sm="4" md="4">
                  <v-text-field dense label="Radicado" v-model="usuario.id" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field dense label="Usuario" v-model="usuario.email" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field dense label="Área" v-model="usuario.area" readonly></v-text-field>
                </v-col>

                <v-col cols="12" sm="4" md="12">
                  <v-text-field dense label="Asunto" v-model="usuario.asunto" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="12">
                  <v-textarea dense label="Descripción" v-model="usuario.descripcion" readonly auto-grow></v-textarea>
                </v-col>
               <v-col v-if="usuario.seguimiento_actividades">
                    <v-alert dense text border="left" color="blue" class="text-center"><b>Respuesta</b>
                    </v-alert>
                  </v-col>
                  <v-col cols="12" sm="12" md="12" v-for="(data, index) in usuario.seguimiento_actividades" :key="index">
                    <v-textarea rows="2" v-model="data.respuesta" readonly :label="`RESPUESTA`">
                    </v-textarea>
                    <span> Respuesta: {{data.user.operador.nombre_completo }}
                      <strong>Fecha: </strong>{{data.created_at }}
                    </span>
                  </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-btn v-for="(data, index) in usuario.adjuntos_mesa_ayuda" :key="index" color="info" class="ml-2" small>
                    <v-icon color="white">mdi-cloud-upload</v-icon>
                    <a @click="imprimirAdjunto(data.ruta)" style="color:white">Adjunto {{index+1}}</a>
                  </v-btn>
                </v-col>
              </v-row>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" small @click="limpiarDialogo()" dark>
                  Cerrar
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
      if (!$can('mesaAyuda.solucionadas')) {
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
        sede_filtro: '',
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
        buscar: '',
        sedes: [
          'SEDE SUMIMEDICAL ITAGÜÍ',
          'SUMIMEDICAL SEDE APOYO TERAPEUTICO',
          'SUMIMEDICAL SEDE PUERTO BERRIO',
          'SUMIMEDICAL RIONEGRO',
          'SUMIMEDICAL QUIBDO',
          'SUMIMEDICAL SEDE BUCARAMANGA',
          'SUMIMEDICAL SEDE TURBO',
          'SUMIMEDICAL COPACABANA',
          'SUMIMEDICAL SEDE CHIGORODÓ',
          'SUMIMEDICAL SEDE ORIENTAL',
          'SUMIMEDICAL SEDE VILLANUEVA',
          'SUMIMEDICAL SEDE ENVIGADO',
          'SUMIMEDICAL SEDE ESTADIO',
          'SUMIMEDICAL SAS BELLO',
          'CLINICA VICTORIANA',
          'SUMIMEDICAL ISTMINA',
          'SUMIMEDICAL SEDE 80',
          'SUMIMEDICAL SEDE AGUACATALA',
          'TRABAJO EN CASA',
          'SUMIMEDICAL SEDE CAUCASIA',
          'SUMIMEDICAL SEDE APARTADO',
        ],
        opciones: [5, 10, 20, 50, 100],
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
            text: 'Asunto',
            value: 'asunto'
          },
          {
            text: 'Categoría',
            value: 'categoria_mesa_ayuda.nombre'
          },
          {
            text: 'Sede Reportante',
            value: 'sedeNombre'
          },
          {
            text: 'Estado',
            value: 'nombreEstado'
          },
          {
            text: 'Fecha Creación',
            value: 'fechacreacion'
          },
          {
            text: 'Acciones',
            value: 'actions'
          },

        ],
        categorias:[],
        asignar:{
          categoria:[]
        },
        categoria:''
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
          sede_filtro: this.sede_filtro,
          categoria:this.categoria
        };
        this.$axios.get('/mesa-ayuda/listarSolucionados', {
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
        this.dialogoPendientes = true,
          this.usuario = item
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
          this.sede_filtro = '',
          this.categoria ='',
          this.ListarCasosMesaAyuda()
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

      },

    }

  }

</script>
