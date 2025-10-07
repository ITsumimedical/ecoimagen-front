<template>
  <div>
    <v-card flat>
      <!-- ESPECIALIDADES -->
      <v-col cols="12" sm="12" md="12">
        <v-card>
          <v-card-title class="headline card" style="color:white">
            <span class="title layout justify-center font-weight-light">Especialidades</span>
          </v-card-title>
          <v-card-actions>
            <v-btn color="success" dark @click="crearEspecialidad = true">
              Crear nueva especialidad
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <v-data-table :headers="headersEspecialidades" :items="especialidades"
              class="elevation-1">
              <template v-slot:[`item.estado`]="{ item }">
                <v-chip :color="getColor(item.estado)" dark>
                  {{ item.estado == '1' ? 'Activo' : 'Inactivo' }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>

          <v-expand-transition>
            <v-card v-if="crearEspecialidad" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;">
              <v-card-title class="headline success" style="color:white">
                <span class="title layout justify-center font-weight-light">Nueva especialidad</span>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="12">
                        <v-text-field v-model="especialidad.nombre" label="Nombre" :error-messages="errores.nombre">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn color="red" dark @click="clearErrores()">
                  Cancelar
                </v-btn>
                <v-btn color="success" dark @click="guardarEspecialidad()">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-card>
  </div>
</template>

<script>
  import {
    listarEspecialidad,
    crearEspecialidad
  } from "@/api/especialidades/especialidad";
  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: "WorkspaceJsonEspecialidadesCoponent",

    data() {
      return {
        crearEspecialidad: false,
        especialidades: [],
        especialidad: {
          nombre: ''
        },
        errores: {
          nombre: ''
        },
        headersEspecialidades: [{
            text: 'id',
            value: 'id',
          },
          {
            text: 'Nombre',
            align: 'start',
            sortable: false,
            value: 'nombre',
          },
          {
            text: 'Estado',
            value: 'estado',
            sortable: false,
          },
        ],
      };
    },

    created() {
      this.listarEspecialidad()
    },


    methods: {
      listarEspecialidad() {
        this.$loadingGetRequest(listarEspecialidad(0, 0)).then(res => {
          this.especialidades = res.data
        }).catch(e => {
          console.log(e.response.data);
        })
      },

      guardarEspecialidad() {
        this.$loadingPostRequest(crearEspecialidad(), this.especialidad).then(res => {
          this.crearEspecialidad = false
          this.listarEspecialidad()
          this.clearEspecialidad()
        }).catch(e => {
          this.errores = e.response.data
        })
      },

      clearErrores() {
        this.crearEspecialidad = false
        this.clearEspecialidad()
        for (const key in this.errores) {
          this.errores[key] = ''
        }
      },

      clearEspecialidad() {
        for (const key in this.especialidad) {
          this.especialidad[key] = ''
        }
      },

      getColor(estado) {
        if (estado == 1) return 'green'
        else return 'red'
      },
    },

  }

</script>

<style>

</style>
