<template>
  <div>
    <v-card-title class="background: card">
      <div class="text-center">
        <span style="color:white">Lista de turnos</span>
      </div>
    </v-card-title>
    <v-data-table :headers="headers" :items="listarTurnos" class="elevation-1" :loading="loading"
      loading-text="Cargando..." no-data-text="Sin datos para mostrar" hide-default-footer :search="buscarTurno">
      <template v-slot:[`item.tipo_turno.color`]="{ item }">
        <v-chip :color="getColor(item.tipo_turno.color)">
          {{ item.tipo_turno.color == '#ff0000' ? '' : item.tipo_turno.color == '#ff0000' ? '' : ''}}</v-chip>
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarTurno" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
      </template>
      <template v-slot:no-data>
        <v-btn color="error" @click="listarTurno">
          No hay información que mostrar
        </v-btn>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarTurno()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  // import {
  //   listarTurno,
  // } from '@/api/turnos/turno'

  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'listarTurno',
    data: () => ({
      paginate: {
        total: 0,
        page: 1
      },
      buscarTurno: '',
      items: [],
      loading: false,
      listarTurnos: [],
      headers: [{
          text: 'id',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        {
          text: 'Nombre',
          value: 'nombre'
        },
        {
          text: 'Cedula',
          value: 'numero_documento'
        },
        {
          text: 'Tipo turno',
          value: 'tipo_turno.nombre'
        },
        {
          text: 'Color',
          value: 'tipo_turno.color'
        }
      ],
    }),

    created() {
      this.listarTurno();
    },

    methods: {
      async listarTurno() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarTurno(this.paginate.page))
          this.listarTurnos = data.data
          this.paginate.total = data.last_page
          this.paginate.page = data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },

      getColor(tipo_turno) {
        if (tipo_turno.color === '#ff0000') return '#D50000'
        else if (tipo_turno.color === '#0020C2') return '#0020C2'
        else return '#0020C2'
      },
    }
  }

</script>
