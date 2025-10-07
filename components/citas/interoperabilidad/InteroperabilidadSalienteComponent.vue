<template>
  <v-data-table
    :headers="headers"
    :items="logs"
    class="text-no-wrap"
    hide-default-footer
    :loading="loading.logs"
  >
    <template v-slot:[`item.status`]="{ item }">
      <v-chip small dark label :color="getColor(item.status)">
        <b> {{ getDescripcion(item.status) }}</b>
      </v-chip>
    </template>
     <template v-slot:[`item.estado_consulta`]="{ item }">
      <v-chip small dark label :color="getColorConsulta(item.estado_consulta)">
        <b> {{ item.estado_consulta }}</b>
      </v-chip>
    </template>
    <template v-slot:no-data>
      <p>Sin citas no enviadas</p>
    </template>

    <template v-slot:top>
      <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="estado"
            outlined
            dense
            :items="estados"
            item-text="text"
            item-value="value"
            label="Estado"
            @change="listarLogs(1)"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="numero_documento"
            outlined
            dense
            label="Numero Documento"
            @keyup.enter="listarLogs(1)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="idTransition"
            outlined
            dense
            label="Id Transición"
            @keyup.enter="listarLogs(1)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dealId"
            outlined
            dense
            label="Deal Id"
            @keyup.enter="listarLogs(1)"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <template v-slot:footer="{ item }">
      <div class="text-center mt-8">
        <v-pagination
          v-model="paginacion.current_page"
          :length="paginacion.last_page"
          @input="listarLogs"
          :total-visible="10"
        ></v-pagination>
      </div>
    </template>
  </v-data-table>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loading: {
        logs: false,
      },
      logs: [],
      search: "",
      estado: null,
      numero_documento: "",
      idTransition: "",
      dealId: "",
      estados: [
        { text: "Enviado", value: "1826" },
        { text: "Cancelado", value: "1271" },
        { text: "Confirmado", value: "1270" },
      ],
      paginacion: {
        current_page: 1,
        last_page: 1,
      },
      headers: [
        {
          text: "N° Consulta",
          value: "consulta_id",
          sortable: false,
          align: "left",
        },
        {
          text: "N° Documento",
          value: "numero_documento",
          sortable: false,
          align: "left",
        },
        {
          text: "Afiliado",
          value: "nombre_afiliado",
          sortable: false,
          align: "left",
        },
        {
          text: "Código de Estado",
          value: "status",
          sortable: false,
          align: "center",
        },
        {
          text: "Estado Consulta",
          value: "estado_consulta",
          sortable: false,
          align: "left",
        },
        {
          text: "Id Transición",
          value: "transition_id",
          sortable: false,
          align: "left",
        },
        {
          text: "Fecha Consulta",
          value: "fecha_consulta",
          sortable: false,
          align: "center",
        },
        {
          text: "fecha log",
          value: "fecha_creacion",
          sortable: false,
          align: "center",
        },
        {
          text: "Deal Id",
          value: "dealId",
        },
      ],
    };
  },

  mounted() {
    this.listarLogs();
  },

  methods: {
    ...mapActions("app", ["setPreload"]),

    async listarLogs(page = 1) {
      try {
        this.loading.logs = true;
        const response = await this.$axios.get("citas/listar-log-keiron", {
          params: {
            page,
            cant: 10,
            estado: this.estado,
            numero_documento: this.numero_documento,
            idTransition: this.idTransition,
            dealId: this.dealId,
          },
        });
        this.paginacion = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
        };
        this.logs = response.data.data;
      } catch (error) {
        this.$toast.error("error al listar los logs");
      } finally {
        this.loading.logs = false;
      }
    },

    getColor(code) {
      switch (code) {
        case "1286":
          return "green";
        case "1271":
          return "orange";
        case "1270":
          return "blue";
        default:
          return "red";
      }
    },

    getColorConsulta(code) {
      switch (code) {
        case "Por Confirmar":
          return "green";
        case "Inasistencia":
          return "orange";
        case "Confirmado Call center":
          return "purple";
        case "Atendido":
          return "blue";
        default:
          return "red";
      }
    },

    getDescripcion(code) {
      switch (code) {
        case "1286":
          return "Enviado Keiron";
        case "1271":
          return "Cancelado Por Keiron";
        case "1270":
          return "Confirmado Por Keiron";
        default:
          return "No Enviado a Keiron";
      }
    },
  },
};
</script>
