<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload_asistencia" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-card flat>
      <v-col sm="6" md="6">
        <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar" single-line hide-details dense>
        </v-text-field>
      </v-col>
      <v-data-table :headers="headers" :items="asistencias_creadas" :search="buscar" :loading="loading"
        loading-text="Cargando..." hide-default-footer dense>
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.Fecha }}</td>
          <td>{{ props.item.NombreAfiliado }}</td>
          <td>{{ props.item.Cedula }}</td>
          <td>{{ props.item.tema }}</td>
          <td>{{ props.item.Nombre_cups }}</td>
          <td>{{ props.item.nombre_completo }}</td>
        </template>
      </v-data-table>
      <v-row no-gutters style="background-color: white;">
        <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
            @input="ListarAsistencias"></v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small @change="ListarAsistencias()">
          </v-select>
        </v-col>
      </v-row>
    </v-card>

  </div>
</template>

<script>

export default {
  data() {
    return {
      asistencias_creadas: [],
      preload_asistencia: false,
      pagina: 1,
      total: 0,
      opcionActual: 5,
      opciones: [5, 10, 20, 50, 100],
      loading: false,
      buscar: "",

      headers: [
        {
          text: 'Id',
          value: 'id'
        },
        {
          text: 'Fecha Creacion',
          value: 'fecha'
        },
        {
          text: 'Afiliado',
          value: 'NombreAfiliado'
        },
        {
          text: 'Numero Documento',
          value: 'Cedula'
        },
        {
          text: 'Tema',
          value: 'tema'
        },
        {
          text: 'Cup',
          value: 'Nombre_cups'
        },
        {
          text: 'Usuario Que Registra',
          value: 'nombre_completo'
        },
      ],
    }
  },

  created() {
    this.ListarAsistencias()
  },

  methods: {
    ListarAsistencias() {
      this.preload_asistencia = true;
      this.$axios.get('/asistencia-educativas/listar?page=' + this.pagina + '&cantidad=' + this.opcionActual).then(res => {
        this.asistencias_creadas = res.data.data;
        this.total = res.data.last_page;
        this.buscar;
        this.preload_asistencia = false;
      }).catch(e => {
        this.preload_asistencia = false;
      });
    },
  }
}
</script>
