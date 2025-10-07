<template>
  <div>
    <ordenamiento></ordenamiento>
    <v-data-table :headers="headers" :items="codigosHorus" class="elevation-1" :loading="loadingTable" loading-text="Cargando... por favor espere" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Codigos Horus</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2">mdi-pencil</v-icon>
        <v-icon small>mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
      </template>
    </v-data-table>

  </div>
</template>
<script>
import ordenamiento from "~/components/ordenamiento/ordenamiento";
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
  components:{ordenamiento},
  name:"codigoHorus",
  mounted() {
    this.listaCodigosHorus();
  },
  data: () => ({
    codigosHorus: [],
    loadingTable:false,
    headers: [
      {
        text: 'Codigo',
        align: 'center',
        sortable: false,
        value: 'codigo',
      },
      {
        text: 'Nombre',
        align: 'center',
        sortable: false,
        value: 'nombre',
      },
      {
        text: 'Requiere Autorizacion',
        align: 'center',
        sortable: false,
        value: 'autorizacion',
      },
      {
        text: 'Nivel Ordenamiento',
        align: 'center',
        sortable: false,
        value: 'nivel_ordenamiento',
      },
    ]
  }),
  methods:{
    listaCodigosHorus(){
      this.$axios.$post('/medicamentos/listarCodigosHorus').then(res => {
        this.codigosHorus = res
      })
    }
  }
}
</script>
