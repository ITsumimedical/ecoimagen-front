<template>
  <div>

    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <v-data-table key="id" dense :headers="headers" :items="subcategorias" sort-by="id" class="elevation-1"
      :loading="loading" loading-text="Cargando..." hide-default-footer no-data-text="Sin datos para mostrar">

      <template v-slot:top>
        <v-card-title>
          <v-btn small color="boton" class="mb-2 white--text" @click="nuevo = true">
            Añadir
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarSubcategoria" label="Buscar" append-icon="mdi-magnify" hide-details
            single-line></v-text-field>
        </v-card-title>
      </template><s></s>
    </v-data-table>

    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarSubcategorias">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      subcategorias: [],
      preload: false,

      paginate: {
        total: 0,
        page: 1
      },


    }
  }
}

</script>
