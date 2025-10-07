<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <form @submit.prevent="guardarInformacion">
          <v-card-title class="background: card">
            <span class="white--text text-h5">{{(tipoFormulario === 1 ? "Crear" : "Editar")}} {{info.nombre}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <template v-for="item in this.info.atributos">
                  <v-col v-if="item.tipo === 'texto' && item.visible" cols="12" sm="6" md="4">
                    <v-text-field v-model="form[item.value]" :label="item.text" required></v-text-field>
                  </v-col>
                  <v-col v-if="item.tipo === 'boolean' && item.visible" cols="12" sm="6" md="4">
                    <v-checkbox v-model="form[item.value]" :label="item.text"></v-checkbox>
                  </v-col>
                  <v-col v-if="item.tipo === 'date-time' && item.visible" cols="12" sm="6" md="6">
                    <v-text-field type="datetime-local" v-model="form[item.value]" :label="item.text"></v-text-field>
                  </v-col>
                  <v-col v-if="item.tipo === 'date' && item.visible" cols="12" sm="6" md="6">
                    <v-text-field type="date" v-model="form[item.value]" :label="item.text"></v-text-field>
                  </v-col>
                  <v-col v-if="item.tipo === 'number' && item.visible" cols="12" sm="6" md="4">
                    <v-text-field type="number" v-model="form[item.value]" :label="item.text"></v-text-field>
                  </v-col>
                  <v-col v-if="item.tipo === 'textarea' && item.visible" cols="12" sm="6" md="12">
                    <v-textarea v-model="form[item.value]" :label="item.text"></v-textarea>
                  </v-col>
                   <v-col v-if="item.tipo === 'textoGrande' && item.visible" cols="12" sm="6" md="12">
                    <v-text-field v-model="form[item.value]" :label="item.text" required></v-text-field>
                  </v-col>
                   <v-col v-if="item.tipo === 'textoMediano' && item.visible" cols="12" sm="6" md="6">
                    <v-text-field v-model="form[item.value]" :label="item.text" required></v-text-field>
                  </v-col>
                </template>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="alerta" @click="dialog=false" dark>Cancelar</v-btn>
            <v-btn type="submit" color="boton" dark>Guardar</v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
    <v-data-table :headers="header" :search="buscar" :items="listaInformacion" class="elevation-1" :loading="loading"
      loading-text="Cargando..." hide-default-footer>
      <template v-slot:top>
          <v-card-title>
          <v-btn color="success" class="ma-2 white--text"
            @click="abrirModal(1)">
            Crear
            <v-icon right dark>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar" single-line hide-details>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:[`item.estado_id`]="{ item }">
        <v-chip :color="getColor(item.estado_id)" dark>
          {{ getName(item.estado_id) }}
        </v-chip>
      </template>
      <template v-slot:[`item.disponible`]="{ item }">
        <v-chip :color="getColor(item.disponible)" dark>
          {{ getName(item.disponible) }}
        </v-chip>
      </template>
      <template v-slot:[`item.estado`]="{ item }">
        <v-chip :color="getColor(item.estado)" dark>
          {{ getName(item.estado) }}
        </v-chip>
      </template>
      <template v-slot:[`item.multiples`]="{ item }">
        {{ item.multiples == '1' ? 'Si' : 'No' }}
      </template>
      <template v-slot:[`item.sancion`]="{ item }">
        {{ item.sancion == '1' ? 'Si' : 'No' }}
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <v-icon small color="warning" class="mr-2" @click="abrirModal(2,item)">mdi-pencil</v-icon>
      </template>
      <template v-slot:no-data>
        No hay información para mostrar
      </template>
    </v-data-table>
    <!-- <template>
          <div class="text-center">
            <v-pagination v-model="paginar.paginas" :length="paginar.total" :total-visible="7"
              @input="listar()">
            </v-pagination>
          </div>
        </template> -->
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
    name: '',
    props: {
      info: Object
    },
    beforeMount() {
      this.listar();
      this.header = this.info.atributos
      this.header.push({
        text: "Acciones",
        value: 'acciones',
        align: 'center',
        sortable: false
      })
    },
    data: () => ({
      idEdit: null,
      tipoFormulario: 0,
      dialog: false,
      loading: false,
      buscar: '',
      listaInformacion: [],
      selectInformacion:[],
      header: [],
      form: {},
      paginar: {
          total: 0,
          paginas: 1
        },
    }),
    methods: {
      listar() {
        this.dialog = false;
        this.loading = true;
        this.$axios.get(this.info.rutaListar).then(res => {
          this.listaInformacion = res.data.data;
          this.loading = false;
        }).catch(e => {
          console.log(e)
          this.loading = false;
        })
      },
      getColor(estado) {
        if (parseInt(estado) === 1) return 'green'
        else if (parseInt(estado) === 2) return 'red'
        else return 'orange'
      },
      getName(estado) {
        if (parseInt(estado) === 1) return 'Activo'
        else if (parseInt(estado) === 2) return 'Inactivo'
      },
      abrirModal(tipo, item = {}) {
        this.form = {};
        this.idEdit = null;
        this.tipoFormulario = tipo;
        if (this.tipoFormulario != 1) {
          for (const prop in item) {
            if (prop === 'id') {
              this.idEdit = item[prop]
            } else {
              this.form[prop] = item[prop]
            }
          }
        }
        this.dialog = true;
      },

      guardarInformacion() {
        this.loading = true;
        if (this.tipoFormulario === 1) {
          this.$axios.post(this.info.rutaGuardar, this.form).then(res => {
            this.listar();
            this.loading = false;
          }).catch(e => {
            this.listar();
            this.loading = false;
          })
        } else {
          this.$axios.put(this.info.rutaActulizar + this.idEdit, this.form).then(res => {
            this.listar();
            this.loading = false;
          }).catch(e => {
            this.loading = false;
          })
        }

      }

    },
  }

</script>
