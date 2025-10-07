<template>
  <div>
    <v-card>
      <v-container>
        <form @submit.prevent="agregarArticulo(checkboxLote,articulo,motivo,loteViejo,loteNuevo,cantidad,fecha_vencimiento,observacion)">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete @change="listarVademecumBodega" v-model="formAjusteEntrada.bodega_origen_id"
                label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre" item-value="id" required>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete v-model="motivo" :items="motivosAjustes" label="Motivo*" required></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="motivo === 'Error Ingreso en Factura'">
                <v-text-field label="Número de factura" dense v-model="buscarExistencia" :loading="cargandoExistencias">
                </v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-autocomplete @change="listarLotes(articulo)" v-model="articulo" label="Articulo*" :loading="cargando"
                :items="listaMedicamentos"
                :item-text="listaMedicamentos => listaMedicamentos.invima?listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+listaMedicamentos.invima.titular+' - '+listaMedicamentos.invima.cum_validacion+')':listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - SIN EXPEDIENTE'+')'"
                return-object required no-data-text="Debe ingresar el nombre del medicamento"></v-autocomplete>
            </v-col>

            <v-col cols="12" md="3" v-if="checkboxLote != true">
              <v-autocomplete @change="fechaVencimiento(loteViejo)" v-model="loteViejo" label="Lote*" :loading="cargandoLotes"
                :items="listaLotes" :item-text="listaLotes => listaLotes.codigo+' Cantidad: '+listaLotes.cantidad"
                return-object required no-data-text="Cargando ...">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="3">
              <v-checkbox v-model="checkboxLote" label="Sin lote"></v-checkbox>
            </v-col>

            <v-col cols="12" md="3" v-if="checkboxLote == true">
              <v-text-field v-model="loteNuevo" label="Lote Nuevo" required></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="fecha_vencimiento" label="Fecha vencimiento*" required type="date"></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field v-model="cantidad" label="Cantidad*" type="number" required></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-textarea v-model="observacion" label="Observación*"></v-textarea>
            </v-col>

            <v-col cols="12" md="2" offset-md="10">
              <v-btn color="primary" :loading="cargando" :disabled="cargando" type="submit">Agregar
                <template v-slot:loader>
                  <span>Cargando...</span>
                </template>
              </v-btn>
            </v-col>
          </v-row>

        </form>
        <v-row>
          <v-col cols="12" md="12">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-center">Codigo</th>
                    <th class="text-center">Motivo</th>
                    <th class="text-center">Medicamento</th>
                    <th class="text-center">Presentacion</th>
                    <th class="text-center">Lote</th>
                    <th class="text-center">Descripción</th>
                    <th class="text-center">Fecha Vencimiento</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in listaArticulosAgregados" :key="item.id">
                    <td class="text-center">{{ index+1 }}</td>
                    <td class="text-center">
                      {{ item.articulo.invima == null?'SIN EXPEDIENTE':item.articulo.invima.cum_validacion}}</td>
                    <td class="text-center">{{ item.descripcion}}</td>
                    <td class="text-center">{{ item.articulo.codesumi.nombre}}</td>
                    <td class="text-center">
                      {{ item.articulo.invima == null?'SIN EXPEDIENTE':item.articulo.invima.descripcion_comercial}}</td>
                    <td class="text-center">{{ item.lote}}</td>
                    <td class="text-center">{{ item.observacion}}</td>
                    <td class="text-center">{{ item.fecha_vencimiento}}</td>
                    <td class="text-center">{{ item.cantidad_inicial}}</td>
                    <td class="text-center">
                      <v-btn class="mx-2" fab dark small color="error" @click="eliminarArticulo(index)">
                        <v-icon dark>mdi-close</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn v-if="listaArticulosAgregados.length > 0" block color="success" @click="enviarSolicitud">Enviar
              Solicitud</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
  import {
    listarBodegas
  } from "~/api/bodegas/bodegas";
  import {
    crearsolicitudBodegas
  } from "~/api/solicitudBodegas/solicitudBodega";

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('farmacia.movimientos')) {
        return redirect('/');
      }
    },
    name: "ajusteEntrada",
    props: ["tipo"],

    mounted() {
      this.listarBodegas();
    },

    watch: {
        buscarExistencia(val) {
      if(val && val.length === 5) {
        this.verificarExistenciaFactura(val);
      } else {
        this.facturasExistentes = []
      }
    }
    },

    data: () => ({
      motivo: null,
      cargando: false,
      cargandoLotes: false,
      listaBodegas: [],
      checkboxLote: false,
      cargandoExistencias: false,
      listaLotes: [],
      listaMedicamentos: [],
      listaArticulosAgregados: [],
      articulo: null,
      formAjusteEntrada: {
        bodega_origen_id: null
      },
      descripcion: null,
      observacion: null,
      loteNuevo: null,
      loteViejo: null,
      cantidad: null,
      fecha_vencimiento: null,
      buscarExistencia: null,
      motivosAjustes: [
        'Aprovechamiento',
        'Avería',
        'Cambio de Código',
        'Conteo',
        'Devolución Paciente',
        'Error de Dispensación',
        'Error Ingreso en Factura',
        'Promociones y Muestras',
        'Vencimiento',
        'Salida colaborador',
        'Traslado Sumimedical',
        'Traslado Clinica Victoriana'
      ]
    }),
    methods: {
      listarBodegas() {
        // this.preload = true;
        this.$axios.get('/bodegas/listarBodegasAsociadas').then(res => {
          this.listaBodegas = res.data;
        }).catch(e => {
          console.log(e.response)
        })
      },

      listarVademecumBodega() {
        this.cargando = true
        this.$axios.get('bodega-medicamentos/bodegaEntrada/' + this.formAjusteEntrada.bodega_origen_id).then(res => {
          this.listaMedicamentos = res.data;
          this.cargando = false
          this.limpiarFormulario();
        }).catch(e => {
          this.cargando = false
          console.log(e.response);
        })
      },

      limpiarFormularios() {
        this.articulo = null
        this.motivo = null
        this.lote = null
        this.cantidad = null
        this.loteNuevo = null
        this.loteViejo = null
        this.fecha_vencimiento = null
        this.observacion = null
      },

      agregarArticulo(checkboxLote, articulo, motivo, loteViejo, loteNuevo, cantidad, fecha_vencimiento, observacion) {
        if (this.motivo === "Error Ingreso en Factura" && !this.buscarExistencia) {
            return this.$toast.error("Ingrese un número de factura para poder realizar el ajuste de entrada");
        }
        // Asigna lote en función de si loteNuevo es nulo o no
        const lote = checkboxLote == false ? loteViejo.codigo : loteNuevo;

        // Datos a agregar
        const data = {
          articulo: articulo,
          medicamento_id: articulo.medicamento_id,
          cantidad_inicial: cantidad,
          lote: lote,
          fecha_vencimiento: fecha_vencimiento,
          descripcion: motivo,
          observacion: observacion,
          bodega: this.formAjusteEntrada.bodega_origen_id,
          tipo: this.tipo
        };
        if (parseInt(this.cantidad) <= 0) {
          return this.$swal(
            'Valor incorrecto!',
            'El Campo "Cantidad" debe tener un valor mayor a 0',
            'error'
          )
        }
        this.cargando = true;
        this.listaArticulosAgregados.push(data)
        this.limpiarFormularios();
        this.cargando = false;

      },

      eliminarArticulo(id) {
        this.listaArticulosAgregados.splice(id, 1);
      },

      enviarSolicitud() {
        this.$swal({
          title: 'Esta Seguro?',
          text: "Generar Solicitud por Ajuste de entrada",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.value) {
            let form = this.formAjusteEntrada;
            form.tipo_solicitud_bodega_id = this.tipo;
            form.bodega_destino_id = form.bodega_origen_id;
            form.articulos = this.listaArticulosAgregados;
            this.$loadingPostRequest(crearsolicitudBodegas(), form).then(res => {
              this.articulo = null
              this.motivo = null
              this.lote = null
              this.cantidad = null
              this.observacion = null
              this.listaArticulosAgregados = [];
              this.formAjusteEntrada.bodega_origen_id = null;
              this.$swal({
                title: 'Solicitud por Ajuste de Entrada',
                text: 'Se ha registrado la solicitud con id:' + ' ' + res.data,
                type: 'info',
                showCancelButton: false,
                cancelButtonColor: '#d33',
              })
            })
          }
        })
      },

      listarLotes(articulo) {
        const data = {
          medicamento_id: articulo.medicamento_id,
          bodega: this.formAjusteEntrada.bodega_origen_id,
        }
        this.cargandoLotes = true
        this.$axios.post('bodega-medicamentos/buscarLoteMedicamentoEntrada', data).then((res) => {
          this.cargandoLotes = false
          this.listaLotes = res.data
        }).catch(e => {
          this.cargandoLotes = false
          this.error = true
        })
      },

      fechaVencimiento(lote) {
        this.fecha_vencimiento = lote.fecha_vencimiento
      },

    verificarExistenciaFactura(factura_id) {
    this.cargandoExistencias = true;
    this.$axios.get(`movimientos/verificar-existencia-factura/${factura_id}`)
      .then((res) => {
        if (res.data.length === 0) {
          this.$toast.error('No hay facturas registradas con el código ingresado');
          this.motivo = ''
          this.buscarExistencia = null
        } else {
          this.$toast.success('La factura existe y puede proceder con el registro del ajuste');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.cargandoExistencias = false;
      });
    }
    }
  }

</script>
