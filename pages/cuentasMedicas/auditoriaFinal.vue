<template>
    <div>
        <v-row dense>
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Procesando Información
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-col cols="12" sm="12" md="12">
                <v-card flat>
                    <v-bottom-navigation :value="true" color="primary">
                        <v-btn
                            @click="pendientes= true, conciliacion=false, cerradas = false, conciliacionSaldo = false,nombre_prestador='',nit='' ,auditoriaFinal()">
                            <h4>PENDIENTES</h4>
                        </v-btn>

                        <v-btn
                            @click="pendientes= false, conciliacion=true, cerradas = false,conciliacionSaldo = false,nombre_prestador='',nit='' ,ConciliacionAuditoriaFinal()">
                            <h4>CONCILIACIÓN</h4>
                        </v-btn>

                        <v-btn
                            @click="pendientes= false, conciliacion=false, cerradas = false,conciliacionSaldo = true, nombre_prestador='',nit='',conciliadasConSaldo()">
                            <h4>CONCILIADAS CON SALDO</h4>
                        </v-btn>

                        <v-btn
                            @click="pendientes= false, conciliacion=false, cerradas = true,conciliacionSaldo = false,nombre_prestador='',nit='',facturasCerradas()">
                            <h4>CERRADAS</h4>
                        </v-btn>
                    </v-bottom-navigation>

                    <v-col cols="12" sm="12" md="12" v-show="pendientes">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nombre_prestador" label="Nombre prestador">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="nombre_prestador='',nit='',auditoriaFinal()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="auditoriaFinal()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headers" :items="listaAuditadas"
                                    no-data-text="Sin datos para mostrar" hide-default-footer disable-pagination>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2"
                                            @click="facturasAuditadas(item.nit,item.id)">Ver
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.totalneto`]="{ item }">
                                        <td>$ {{Math.trunc(item.totalneto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                            @input="auditoriaFinal()">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                            @change="auditoriaFinal()">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-show="conciliacion">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nombre_prestador" label="Nombre prestador">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small
                                    @click="nombre_prestador='',nit='',ConciliacionAuditoriaFinal()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="ConciliacionAuditoriaFinal()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headers" :items="listaConciliadas"
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2"
                                            @click="facturasConciliadas(item.nombre_prestador,item.nit,item.id)">Ver
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.totalneto`]="{ item }">
                                        <td>$ {{Math.trunc(item.totalneto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <!-- <v-row no-gutters>
                  <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination v-model="pagina2" class="my-4" :length="total2" :total-visible="9"
                      @input="ConciliacionAuditoriaFinal()">
                    </v-pagination>
                  </v-col>
                  <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual2" :items="opciones2" dense solo small
                      @change="ConciliacionAuditoriaFinal()">
                    </v-select>
                  </v-col>
                </v-row> -->
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-show="conciliacionSaldo">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nombre_prestador" label="Nombre prestador">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="nombre_prestador='',nit='',conciliadasConSaldo()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="conciliadasConSaldo()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headers" :items="listaConciliadasConSaldo"
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2"
                                            @click="facturasConciliadasConSaldo(item.nombre_prestador,item.nit,item.id)">
                                            Ver
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.totalneto`]="{ item }">
                                        <td>$ {{Math.trunc(item.totalneto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="12" sm="12" md="12" v-show="cerradas">
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nombre_prestador" label="Nombre prestador">
                                </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="nit" label="Nit">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small @click="nombre_prestador='',nit='',facturasCerradas()">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="facturasCerradas()">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headers" :items="listaCerradas"
                                    no-data-text="Sin datos para mostrar">
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-btn color="#00b297" dark class="mr-2"
                                            @click="facturasAuditoriaCerradas(item.nit,item.id)">Ver
                                        </v-btn>
                                    </template>
                                    <template v-slot:[`item.totalneto`]="{ item }">
                                        <td>$ {{Math.trunc(item.totalneto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                         </v-row>
                    </v-col>
                </v-card>
            </v-col>

            <v-dialog v-model="dialogoFacturaAuditoriaFinal" max-width="950px" persistent>
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-toolbar-title>Glosas facturas</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numeroFactura" label="Numero factura">
                                </v-text-field>
                            </v-col>
                            <v-card-actions v-if="facturaAuditoriaFinal.length>0">
                                <v-btn color="warning" small
                                    @click="numeroFactura='',facturasAuditadas(prestador,prestador_id)">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="facturasAuditadas(prestador,prestador_id)">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table dense :headers="headersFactura" :items="facturaAuditoriaFinal"
                                    hide-default-footer disable-pagination loading-text="Cargando... por favor espere">
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item.numero_factura)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Adjunto factura</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="verGlosa(item)">
                                                    mdi-eye-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver glosas</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina5" class="my-4" :length="total5" :total-visible="9"
                                            @input="facturasAuditadas(prestador,prestador_id)">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual5" :items="opciones5" dense solo
                                            small @change="facturasAuditadas(prestador,prestador_id)">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogoFacturaAuditoriaFinal=false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoGlosa" v-if="dialogoGlosa" fullscreen hide-overlay
                transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosa = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Glosas</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn color="success" @click="guardarAuditoriaPrestador(glosaFacturaAuditoriaFinal)">Guardar
                            auditoria final
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarGlosaAuditoriaFinal" label="Buscar"
                                        append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table :headers="headersGlosaAuditoriaFinal" :items="glosaFacturaAuditoriaFinal"
                                    loading-text="Cargando... por favor espere" :search="buscarGlosaAuditoriaFinal">
                                    <template v-slot:[`item.respuesta_sumimedical`]="{ item }">
                                        <v-textarea v-model="item.respuesta_sumimedical" rows="1" dense></v-textarea>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoSumi`]="{ item }">
                                        <v-text-field v-model="item.valorAceptadoSumi" rows="1" dense type="number"
                                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" min="1">
                                        </v-text-field>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoSumi`]="{ item }">
                                        <v-text-field v-model="item.valorNoAceptadoSumi" rows="1" dense type="number"
                                            onkeypress="return (event.charCode >= 48 && event.charCode <= 57)" min="1">
                                        </v-text-field>
                                    </template>
                                    <template v-slot:[`item.adjunto`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjunto(item.archivo)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver adjunto</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-menu>
                                            <template #activator="{ on: menu }">
                                                <v-tooltip top>
                                                    <template #activator="{ on: tooltip }">
                                                        <v-btn v-if="item.estado_id != null" color="success"
                                                            v-on="{ ...tooltip, ...menu }">
                                                            <v-icon>mdi-swap-horizontal</v-icon>
                                                        </v-btn>
                                                        <v-btn v-else color="primary" v-on="{ ...tooltip, ...menu }">
                                                            <v-icon>mdi-swap-horizontal</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <span>Acción
                                                        ({{ tipos(item.estado_id) }})</span>
                                                </v-tooltip>
                                            </template>
                                            <v-list>
                                                <v-list-item v-for="(tipo, index) in items" :key="index"
                                                    @click="agregarGlosa(item, tipo.title)">
                                                    <v-list-item-title>{{ tipo.title }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!-- <div class="text-center">
              <v-pagination v-model="paginateGlosaAuditoriaFinal.page" :length="paginateGlosaAuditoriaFinal.total"
                :total-visible="7">
              </v-pagination>
            </div> -->
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoFacturaConciliadaAuditoriaFinal" max-width="950px" persistent>
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-toolbar-title>Glosas facturas</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn fab dark color="success" v-on="on" style="margin-right:7px"
                                                @click="accionConciliacion(facturaConciliadaAuditoriaFinal)">
                                                <v-icon>mdi-cog</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Acción Conciliación</span>
                                    </v-tooltip>

                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn fab dark color="warning" v-on="on"
                                                @click="accionConciliacionAdministrativa()">
                                                <v-icon>mdi-cog</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Conciliación administrativa</span>
                                    </v-tooltip>
                                </v-card-title>
                            </v-col>

                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numeroFactura" label="Numero factura">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small
                                    @click="numeroFactura='',facturasConciliadas(nombrePrestador,prestador,prestador_id)">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small
                                    @click="facturasConciliadas(nombrePrestador,prestador,prestador_id)">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersFactura" :items="facturaConciliadaAuditoriaFinal"
                                    loading-text="Cargando... por favor espere" disable-pagination hide-default-footer>
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item.numero_factura)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Adjunto factura</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="verGlosaConciliacion(item)">
                                                    mdi-eye-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver glosas</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina6" class="my-4" :length="total6" :total-visible="9"
                                            @input="facturasConciliadas(nombrePrestador,prestador,prestador_id)">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual6" :items="opciones6" dense solo
                                            small @change="facturasConciliadas(nombrePrestador,prestador,prestador_id)">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogoFacturaConciliadaAuditoriaFinal=false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoAccionConciliacion" max-width="650px" persistent>
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="NIT" v-model="prestador" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Nombre" v-model="nombrePrestador" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Total persiste Sumimedical"
                                            v-model="listaAccionConciliacion.total" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="2">
                                        <v-btn color="success" @click="importarExcel()">
                                            <v-icon>mdi-attachment</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <input type="file" v-show="false" ref="file" @change="onFilePicked">
                                    <v-col cols="12" sm="12" md="10">
                                        <v-text-field label="Nombre Excel" v-model="nombreArchivo" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <span>Adjuntar Acta de conciliación</span>
                                    <v-col cols="12" sm="12" md="12">
                                        <input ref="adjuntos" type="file" @change="agregarActa" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="cerrarAccionConciliacion()">Salir</v-btn>
                        <v-btn color="success" @click="guardarAccionConciliacion()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoAccionConciliacionAdministrativa" max-width="650px" persistent>
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="NIT" v-model="prestador" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Nombre" v-model="nombrePrestador" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <div class="text-center">
                                            <v-dialog v-model="dialogoImagen" width="1000">
                                                <template v-slot:activator="{ on }">
                                                    <v-btn color="primary" dark v-on="on">Ver Plantilla</v-btn>
                                                </template>
                                                <v-img height="300" width="1500" max-height="60"
                                                    src="/images/plantillaConciliacionAdministrativa.png"></v-img>

                                            </v-dialog>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="2">
                                        <v-btn color="success" @click="importarExcel()">
                                            <v-icon>mdi-attachment</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <input type="file" v-show="false" ref="file" @change="onFilePicked">
                                    <v-col cols="12" sm="12" md="10">
                                        <v-text-field label="Nombre Excel" v-model="nombreArchivo" readonly>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="cerrarAccionConciliacion()">Salir</v-btn>
                        <v-btn color="success" @click="guardarAccionConciliacionAdministrativa()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoGlosaConciliacion" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosaConciliacion = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Glosas</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarfacturaConciliada" label="Buscar"
                                        append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table :headers="headersGlosaConciliada" :items="facturaConciliada"
                                    loading-text="Cargando... por favor espere" :search="buscarfacturaConciliada">
                                    <template v-slot:[`item.adjunto`]="{ item }">
                                        <v-tooltip top v-if="item.archivo != null">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjunto(item.archivo)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver glosas</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!-- <div class="text-center">
              <v-pagination v-model="paginateGlosaConciliacion.page" :length="paginateGlosaConciliacion.total"
                :total-visible="7">
              </v-pagination>
            </div> -->
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoFacturaConciliadaConSaldo" max-width="950px" persistent>
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-toolbar-title>Glosas facturas</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn fab dark color="error" v-on="on"
                                                @click="accionConciliacionConSaldo(facturaConciliadaConSaldo)">
                                                <v-icon>mdi-cog</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Acción Conciliación saldo</span>
                                    </v-tooltip>


                                </v-card-title>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numeroFactura" label="Numero factura">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small
                                    @click="numeroFactura='',facturasConciliadasConSaldo(nombrePrestador,prestador,prestador_id)">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small
                                    @click="facturasConciliadasConSaldo(nombrePrestador,prestador,prestador_id)">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table :headers="headersFactura" :items="facturaConciliadaConSaldo"
                                    loading-text="Cargando... por favor espere" >
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item.numero_factura)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Adjunto factura</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="verGlosaConciliacionConSaldo(item)">
                                                    mdi-eye-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver glosas</span>
                                        </v-tooltip>
                                    </template>
                                </v-data-table>
                            </v-col>

                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogoFacturaConciliadaConSaldo=false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoAccionConciliacionConSaldo" max-width="650px" persistent>
                <v-card>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="NIT" v-model="prestador" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Nombre" v-model="nombrePrestador" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Total persiste Sumimedical"
                                            v-model="listaAccionConciliacionConSaldo.total" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="2">
                                        <v-btn color="success" @click="importarExcel()">
                                            <v-icon>mdi-attachment</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <input type="file" v-show="false" ref="file" @change="onFilePicked">
                                    <v-col cols="12" sm="12" md="10">
                                        <v-text-field label="Nombre Excel" v-model="nombreArchivo" readonly>
                                        </v-text-field>
                                    </v-col>
                                    <span>Adjuntar Acta de conciliación</span>
                                    <v-col cols="12" sm="12" md="12">
                                        <input ref="adjuntos" type="file" @change="agregarActa" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="cerrarAccionConciliacion()">Salir</v-btn>
                        <v-btn color="success" @click="guardarAccionConciliacionConSaldo()">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoGlosaConciliacionConSaldo" fullscreen hide-overlay
                transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosaConciliacionConSaldo = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Glosas</v-toolbar-title>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarfacturaConciliadaSaldo" label="Buscar"
                                        append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table :headers="headersGlosaConciliada" :items="facturaConciliadaSaldo"
                                    loading-text="Cargando... por favor espere" :search="buscarfacturaConciliadaSaldo">
                                    <template v-slot:[`item.adjunto`]="{ item }">
                                        <v-tooltip top v-if="item.adjunto != null">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver glosas</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>

                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>


            <v-dialog v-model="dialogoFacturaCerrada" max-width="950px" persistent>
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-toolbar-title>Glosas facturas</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="3" sm="3" md="3">
                                <v-text-field v-model="numeroFactura" label="Numero factura">
                                </v-text-field>
                            </v-col>
                            <v-card-actions>
                                <v-btn color="warning" small
                                    @click="numeroFactura='',facturasAuditoriaCerradas(prestador,prestador_id)">
                                    Limpiar
                                </v-btn>
                                <v-btn color="info" small @click="facturasAuditoriaCerradas(prestador,prestador_id)">
                                    filtrar
                                </v-btn>
                            </v-card-actions>
                            <v-col cols="12" sm="12" md="12">
                                <v-data-table dense :headers="headersFactura" :items="facturaCerrada"
                                    loading-text="Cargando... por favor espere" hide-default-footer disable-pagination>
                                    <template v-slot:[`item.archivo`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item.numero_factura)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>Adjunto factura</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.glosa`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="verGlosaCerrada(item)">
                                                    mdi-eye-outline
                                                </v-icon>
                                            </template>
                                            <span>Ver glosas</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valor_neto`]="{ item }">
                                        <td>$ {{Math.trunc(item.valor_neto).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                                <v-row no-gutters>
                                    <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                        <v-pagination v-model="pagina7" class="my-4" :length="total7" :total-visible="9"
                                            @input="facturasConciliadas(nombrePrestador,prestador,prestador_id)">
                                        </v-pagination>
                                    </v-col>
                                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                        <v-select class="my-4" v-model="opcionActual7" :items="opciones7" dense solo
                                            small @change="facturasConciliadas(nombrePrestador,prestador,prestador_id)">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="dialogoFacturaCerrada=false">
                            Cancelar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogoGlosaCerrada" fullscreen hide-overlay transition="dialog-bottom-transition">
                <v-card>
                    <v-toolbar dense dark color="titulo black--text">
                        <v-btn color="black" icon @click="dialogoGlosaCerrada = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Glosas</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-card-title>
                                    <p>Factura # {{ af.numero_factura }}</p>
                                    <v-spacer></v-spacer>
                                </v-card-title>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="buscarGlosaConciliacion" label="Buscar"
                                        append-icon="mdi-magnify">
                                    </v-text-field>
                                </v-col>
                                <v-data-table :headers="headersGlosaConciliada"
                                    :items="glosaFacturaAuditoriaFinalCerrada"
                                    loading-text="Cargando... por favor espere" :search="buscarGlosaConciliacion">
                                    <template v-slot:[`item.respuesta_sumimedical`]="{ item }">
                                        <v-textarea v-model="item.respuesta_sumimedical" rows="1" dense readonly>
                                        </v-textarea>
                                    </template>
                                    <template v-slot:[`item.adjunto`]="{ item }">
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                                    @click="imprimirAdjuntoFactura(item)">
                                                    mdi-file-chart-outline
                                                </v-icon>
                                            </template>
                                            <span>imprimir</span>
                                        </v-tooltip>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoSumi`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoSumi).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorNoAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorNoAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                    <template v-slot:[`item.valorAceptadoPrestador`]="{ item }">
                                        <td>$ {{Math.trunc(item.valorAceptadoPrestador).toLocaleString('es-CO')}}</td>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-dialog>

        </v-row>
    </div>
</template>

<script>
    export default {
        name: 'WorkspaceJsonAuditoriaFinal',
        props: {
            ejecutar: Boolean,
        },

        data() {
            return {
                items: [{
                        title: 'Conciliar',
                    },
                    {
                        title: 'Cerrar'
                    }
                ],
                buscar: '',
                buscarfacturaConciliadaSaldo: '',
                buscarfacturaConciliadaConSaldo: '',
                buscarfacturaConciliada: '',
                buscarConciliadasConSaldo: '',
                buscarFactura: '',
                buscarGlosaAuditoriaFinal: '',
                buscarCerrada: '',
                buscarfacturaCerrada: '',
                buscarGlosaConciliacion: '',
                buscarConciliadas: '',
                buscarfacturaConciliadaAuditoriaFinal: '',
                pendientes: true,
                conciliacion: false,
                conciliacionSaldo: false,
                cerradas: false,
                dialogoFacturaAuditoriaFinal: false,
                dialogoFacturaConciliadaAuditoriaFinal: false,
                dialogoGlosa: false,
                dialogoAccionConciliacion: false,
                dialogoAccionConciliacionAdministrativa: false,
                dialogoImagen: false,
                dialogoGlosaConciliacion: false,
                dialogoFacturaConciliadaConSaldo: false,
                dialogoAccionConciliacionConSaldo: false,
                dialogoGlosaConciliacionConSaldo: false,
                dialogoFacturaCerrada: false,
                dialogoGlosaCerrada: false,
                af: [],
                listaAuditadas: [],
                listaConciliadas: [],
                listaConciliadasConSaldo: [],
                listaCerradas: [],
                facturaAuditoriaFinal: [],
                glosaFacturaAuditoriaFinal: [],
                facturaConciliadaAuditoriaFinal: [],
                facturaConciliada: [],
                facturaConciliadaConSaldo: [],
                facturaConciliadaSaldo: [],
                facturaCerrada: [],
                listaAccionConciliacion: [],
                listaAccionConciliacionConSaldo: [],
                glosaFacturaAuditoriaFinalCerrada: [],
                nombreArchivo: '',
                excels: {},
                actas: {},
                headers: [{
                        text: 'Nombre prestador',
                        align: 'left',
                        value: 'nombre_prestador'
                    },
                    {
                        text: 'Nit',
                        value: 'nit'
                    },
                    {
                        text: 'Total facturas',
                        value: 'totalfacturas'
                    },
                    {
                        text: 'Total valor neto',
                        value: 'totalneto'
                    },
                    {
                        text: 'Glosa',
                        value: 'glosa'
                    }
                ],
                headersFactura: [{
                        text: '# Factura',
                        align: 'left',
                        value: 'numero_factura'
                    },
                    {
                        text: 'Valor neto',
                        value: 'valor_neto',
                        align: 'left'
                    },
                    // {
                    //   text: 'Servicio',
                    //   align: 'left',
                    //   value: 'servicio',
                    //   sortable: false
                    // },
                    {
                        text: '',
                        value: 'archivo',
                        sortable: false
                    },
                    {
                        text: '',
                        value: 'glosa',
                        sortable: false
                    }
                ],
                headersGlosaAuditoriaFinal: [{
                        text: 'Codigo respuesta',
                        align: 'left',
                        value: 'codigo',
                        sortable: false
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'respuesta_prestador',
                        sortable: false
                    },
                    {
                        text: 'Valor aceptado',
                        align: 'left',
                        value: 'valorAceptadoPrestador',
                        sortable: false
                    },
                    {
                        text: 'Valor no aceptado',
                        value: 'valorNoAceptadoPrestador',
                        align: 'left',
                        sortable: false
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'respuesta_sumimedical',
                        sortable: false
                    },
                    {
                        text: 'Levanta sumimedical',
                        align: 'left',
                        value: 'valorAceptadoSumi',
                        sortable: false
                    },
                    {
                        text: 'Persiste sumimedical',
                        align: 'left',
                        value: 'valorNoAceptadoSumi',
                        sortable: false
                    },
                    {
                        text: 'Archivo',
                        align: 'left',
                        value: 'adjunto',
                        sortable: false
                    },
                    {
                        text: 'Acciones',
                        align: 'left',
                        value: 'glosa',
                        sortable: false
                    }
                ],
                headersGlosaConciliada: [{
                        text: 'Codigo respuesta',
                        align: 'left',
                        value: 'codigo',
                        sortable: false
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'respuesta_prestador',
                        sortable: false
                    },
                    {
                        text: 'Valor aceptado',
                        align: 'left',
                        value: 'valorAceptadoPrestador',
                        sortable: false
                    },
                    {
                        text: 'Valor no aceptado',
                        value: 'valorNoAceptadoPrestador',
                        align: 'left',
                        sortable: false
                    },
                    {
                        text: 'Descripción',
                        align: 'left',
                        value: 'respuesta_sumimedical',
                        sortable: false
                    },
                    {
                        text: 'Levanta sumimedical',
                        align: 'left',
                        value: 'valorAceptadoSumi',
                        sortable: false
                    },
                    {
                        text: 'Persiste sumimedical',
                        align: 'left',
                        value: 'valorNoAceptadoSumi',
                        sortable: false
                    },
                    {
                        text: 'Archivo',
                        align: 'left',
                        value: 'adjunto',
                        sortable: false
                    },

                ],
                nombrePrestador: '',
                prestador: '',
                prestador_id: '',
                pagina: 1,
                total: 0,
                opcionActual: 5,
                opciones: [5, 10, 20, 50, 100],
                pagina2: 1,
                total2: 0,
                opcionActual2: 5,
                opciones2: [5, 10, 20, 50, 100],
                pagina3: 1,
                total3: 0,
                opcionActual3: 5,
                opciones3: [5, 10, 20, 50, 100],
                pagina4: 1,
                total4: 0,
                opcionActual4: 5,
                opciones4: [5, 10, 20, 50, 100],
                pagina5: 1,
                total5: 0,
                opcionActual5: 5,
                opciones5: [5, 10, 20, 50, 100],
                pagina6: 1,
                total6: 0,
                opcionActual6: 5,
                opciones6: [5, 10, 20, 50, 100],
                pagina7: 1,
                total7: 0,
                opcionActual7: 5,
                opciones7: [5, 10, 20, 50, 100],
                pagina8: 1,
                total8: 0,
                opcionActual8: 5,
                opciones8: [5, 10, 20, 50, 100],
                preload: false,
                nombre_prestador: '',
                nit: '',
                numeroFactura: ''
            };
        },

        mounted() {

        },

        watch: {
            ejecutar() {
                if (this.ejecutar == true) {
                    this.auditoriaFinal()
                }
            }
        },


        methods: {

            auditoriaFinal() {
                this.preload = true
                this.$axios.post('prestador/auditoriaFinal?page=' + this.pagina + '&cantidad=' + this.opcionActual, {
                    nombre_prestador: this.nombre_prestador,
                    nit: this.nit
                }).then(res => {
                    this.preload = false
                    this.listaAuditadas = res.data.data
                    this.total = res.data.last_page
                    this.$emit("updateCount");
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            facturasAuditadas(prestador, id) {
                this.limpiar()
                this.preload = true
                this.prestador = prestador
                this.prestador_id = id
                this.$axios.post('factura/facturaAuditoriaFinal?page=' + this.pagina5 + '&cantidad=' + this
                    .opcionActual5, {
                        numeroFactura: this.numeroFactura,
                        id: id
                    }).then(res => {
                    this.preload = false
                    this.facturaAuditoriaFinal = res.data.data
                    this.total5 = res.data.last_page
                    this.dialogoFacturaAuditoriaFinal = true
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            async imprimirAdjuntoFactura(numeroFactura) {
                let ruta = '/facturascuentasmedicas/' + this.prestador + '/' + numeroFactura + '.pdf';
                try {
                    let adj = await this.$adjuntos(ruta);
                    let blob = new Blob([adj[1]], {
                        type: adj[0],
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                } catch (error) {
                    this.$toast.error('El adjunto de la factura no existe!')
                    console.log(error.response);
                }
            },

            async imprimirAdjunto(ruta) {
                try {
                    let adj = await this.$adjuntos(ruta);
                    let blob = new Blob([adj[1]], {
                        type: adj[0],
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                } catch (error) {
                    this.$toast.error('El adjunto de la factura no existe!')
                    console.log(error.response);
                }
            },

            verGlosa(afs) {
                this.limpiar()
                this.af = afs
                this.dialogoGlosa = true
                this.preload = true
                this.$axios.get('glosa/facturaGlosaAuditoriaFinal/' + afs.id).then(res => {
                    this.preload = false
                    this.glosaFacturaAuditoriaFinal = res.data
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            tipos(val) {
                if (val == 1) {
                    return 'Conciliación'
                } else if (val == 2) {
                    return 'Cerrado'
                } else {
                    return 'Ninguna'
                }
            },

            agregarGlosa(glosa, tipo) {
                this.preload = true
                if (!glosa.respuesta_sumimedical || !glosa.valorAceptadoSumi || !glosa.valorNoAceptadoSumi) {
                    this.preload = false
                    this.$toast.error('Debe diligenciar los datos obligatorios!');
                    return
                }
                let sumaPrestador = parseInt(glosa.valorNoAceptadoPrestador);
                let sumaSumi = parseInt(glosa.valorAceptadoSumi) + parseInt(glosa.valorNoAceptadoSumi);
                if (sumaPrestador < sumaSumi) {
                    this.preload = false
                    this.$toast.error('La suma de los valores Sumimedical son mayores a los del Prestador!');
                    return
                }

                const data = {
                    id: glosa.id,
                    respuesta_sumimedical: glosa.respuesta_sumimedical,
                    valorAceptadoSumi: glosa.valorAceptadoSumi,
                    valorNoAceptadoSumi: glosa.valorNoAceptadoSumi,
                    tipo: tipo
                }
                this.$axios.post('radicacion-glosa-sumimedical/crearActualizarRadicacionGlosa', data).then(res => {
                    this.preload = false
                    this.$toast.success('Respuesta a glosa guardada con exito!');
                    this.verGlosa(this.af)
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })

            },

            guardarAuditoriaPrestador(factura) {
                let vacio = false;
                for (let i = 0; i < factura.length; i++) {
                    const element = factura[i]
                    if (element.estado_id == null) {
                        vacio = true;
                        break;
                    }
                }
                if (vacio == true) {
                    this.$toast.error('No ha dado respuesta a todas las glosas.')
                    return;
                }
                this.preload = true
                this.$axios.post('factura/guardarAuditoriaFinal', {
                    af_id: this.af.id
                }).then(res => {
                    this.preload = false
                    this.auditoriaFinal();
                    this.dialogoGlosa = false
                    this.dialogoFacturaAuditoriaFinal = false
                    // this.$toast.success(this.$toast.success(res.data.mensaje))
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            ConciliacionAuditoriaFinal() {
                this.preload = true
                this.$axios.post('prestador/conciliadasAuditoriaFinal', {
                        nombre_prestador: this.nombre_prestador,
                        nit: this.nit
                    })
                    .then(res => {
                        this.preload = false
                        this.listaConciliadas = res.data
                        // this.total2 = res.data.last_page
                    }).catch(e => {
                        console.log(e);
                        this.preload = false
                    })
            },

            facturasConciliadas(nombre_prestador, nit, id) {
                this.limpiar()
                this.preload = true
                this.nombrePrestador = nombre_prestador
                this.prestador = nit
                this.prestador_id = id
                this.$axios.post('factura/facturaConciliadaAuditoriaFinal?page=' + this.pagina6 + '&cantidad=' + this
                    .opcionActual6, {
                        numeroFactura: this.numeroFactura,
                        id: id
                    }).then(res => {
                    this.preload = false
                    this.facturaConciliadaAuditoriaFinal = res.data.data
                    this.dialogoFacturaConciliadaAuditoriaFinal = true
                    this.total6 = res.data.last_page
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            accionConciliacion(factura) {
                let formatDate = new FormData();
                for (let i = 0; i < factura.length; i++) {
                    formatDate.append('af_id[]', factura[i].id)
                }

                this.$axios.post('factura/conciliar', formatDate).then(res => {
                    this.dialogoAccionConciliacion = true
                    this.listaAccionConciliacion = res.data
                }).catch(e => {
                    console.log(e);
                })
            },

            importarExcel() {
                this.nombreArchivo = ''
                this.$refs.file.value = null
                this.$refs.file.click()
            },

            onFilePicked(e) {
                let ex = e.target.files
                this.nombreArchivo = ex[0].name
                this.excels.file = ex[0]
            },

            agregarActa(e) {
                const acta = e.target.files
                this.actas.file = acta[0]
            },

            cerrarAccionConciliacion() {
                this.nombreArchivo = ''
                this.$refs.file.value = null
                this.dialogoAccionConciliacion = false
                this.dialogoAccionConciliacionAdministrativa = false
                this.dialogoAccionConciliacionConSaldo = false
                this.actas.file = ''
                this.excels.file = ''
            },

            guardarAccionConciliacion() {
                if (this.excels.file == undefined) {
                    this.$toast.error('No se ha cargado el excel.')
                    return;
                }
                let formData = new FormData();
                formData.append('excel', this.excels.file);
                formData.append('adjunto', this.actas.file);
                formData.append('prestador_id', this.prestador_id)
                formData.append('nit_prestador', this.prestador)
                this.preload = true
                this.$axios.post('radicacion-glosa-sumimedical/guardarAccionConciliacion', formData).then(res => {
                    this.$toast.success(res.data);
                    this.cerrarAccionConciliacion()
                    this.ConciliacionAuditoriaFinal()
                    this.dialogoFacturaConciliadaAuditoriaFinal = false
                }).catch(e => {
                    this.$toast.error(e.response.data.mensaje)
                    this.preload = false
                    console.log(e);
                })
            },

            accionConciliacionAdministrativa() {
                this.dialogoAccionConciliacionAdministrativa = true
            },

            guardarAccionConciliacionAdministrativa() {
                if (this.excels.file == undefined) {
                    this.$toast.error('No se ha cargado el excel.')
                    return;
                }
                let formData = new FormData();
                formData.append('excel', this.excels.file);
                formData.append('prestador_id', this.prestador_id)
                formData.append('nit_prestador', this.prestador)
                this.$axios.post('radicacion-glosa-sumimedical/guardarAccionConciliacionAdministrativa', formData).then(
                    res => {
                        this.$toast.success(res.data);
                        this.cerrarAccionConciliacion()
                        this.ConciliacionAuditoriaFinal()
                        this.dialogoFacturaConciliadaAuditoriaFinal = false
                    }).catch(e => {
                    this.$toast.error(e.response.data.mensaje)
                    console.log(e);
                })
            },

            verGlosaConciliacion(afs) {
                this.limpiar()
                this.af = afs
                this.dialogoGlosaConciliacion = true
                this.$axios.get('glosa/facturaConciliada/' + this.af.id).then(
                    res => {
                        this.facturaConciliada = res.data
                        // this.paginateGlosaConciliacion.page = res.data.current_page
                        // this.paginateGlosaConciliacion.total = res.data.last_page
                    }).catch(e => {
                    console.log(e);
                })
            },

            conciliadasConSaldo() {
                this.preload = true
                this.$axios.post('prestador/consiliadasConSaldo', {
                        nombre_prestador: this.nombre_prestador,
                        nit: this.nit
                    }).then(res => {
                    this.preload = false
                    this.listaConciliadasConSaldo = res.data
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            facturasConciliadasConSaldo(nombre_prestador, nit, id) {
                this.limpiar()
                this.nombrePrestador = nombre_prestador
                this.prestador = nit
                this.prestador_id = id
                this.$axios.post('factura/facturaConciliadaConsaldo', {
                        numeroFactura: this.numeroFactura,
                        id: id
                    }).then(res => {
                    this.facturaConciliadaConSaldo = res.data
                    this.dialogoFacturaConciliadaConSaldo = true
                }).catch(e => {
                    console.log(e);
                })
            },

            accionConciliacionConSaldo(factura) {
                let formatDate = new FormData();
                for (let i = 0; i < factura.length; i++) {
                    formatDate.append('af_id[]', factura[i].id)
                }

                this.$axios.post('factura/conciliarConSaldo', formatDate).then(res => {
                    this.dialogoAccionConciliacionConSaldo = true
                    this.listaAccionConciliacionConSaldo = res.data
                }).catch(e => {
                    console.log(e);
                })
            },

            guardarAccionConciliacionConSaldo() {
                if (this.excels.file == undefined) {
                    this.$toast.error('No se ha cargado el excel.')
                    return;
                }
                let formData = new FormData();
                formData.append('excel', this.excels.file);
                formData.append('adjunto', this.actas.file);
                formData.append('prestador_id', this.prestador_id)
                formData.append('nit_prestador', this.prestador)
                this.$axios.post('radicacion-glosa-sumimedical/guardarAccionConciliacionConSaldo', formData).then(
                    res => {
                        this.$toast.success(res.data);
                        this.cerrarAccionConciliacion()
                        this.conciliadasConSaldo()
                        this.dialogoFacturaConciliadaConSaldo = false
                    }).catch(e => {
                    this.$toast.error(e.response.data.mensaje)
                    console.log(e);
                })
            },

            verGlosaConciliacionConSaldo(afs) {
                this.limpiar()
                this.af = afs
                this.dialogoGlosaConciliacionConSaldo = true
                this.$axios.get('glosa/facturaConciliadaConSaldo/' + this.af.id).then(res => {
                    this.facturaConciliadaSaldo = res.data
                    // this.paginateGlosaConciliacionConSaldo.page = res.data.current_page
                    // this.paginateGlosaConciliacionConSaldo.total = res.data.last_page
                }).catch(e => {
                    console.log(e);
                })
            },

            facturasCerradas() {
                this.preload = true
                this.$axios.post('prestador/auditoriaFinalCerradas', {
                    nombre_prestador: this.nombre_prestador,
                    nit: this.nit
                }).then(res => {
                    this.preload = false
                    this.listaCerradas = res.data
                    //  this.total4 = res.data.last_page
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            facturasAuditoriaCerradas(nit, id) {
                this.limpiar();
                this.prestador = nit
                this.prestador_id = id
                this.$axios.post('factura/facturaCerradas?page=' + this.pagina7 + '&cantidad=' + this.opcionActual7, {
                    numeroFactura: this.numeroFactura,
                    id: id
                }).then(
                    res => {
                        this.facturaCerrada = res.data.data
                        this.dialogoFacturaCerrada = true
                        this.total7 = res.data.last_page
                    }).catch(e => {
                    console.log(e);
                })
            },

            verGlosaCerrada(afs) {
                this.limpiar()
                this.af = afs
                this.dialogoGlosaCerrada = true
                this.$axios.get('glosa/glosasCerrada/' + afs.id).then(res => {
                    this.glosaFacturaAuditoriaFinalCerrada = res.data
                }).catch(e => {
                    console.log(e);
                })
            },

            limpiar() {
                this.buscar = '',
                    this.buscarFactura = '',
                    this.buscarGlosaAuditoriaFinal = '',
                    this.buscarCerrada = '',
                    this.buscarfacturaCerrada = '',
                    this.buscarGlosaConciliacion = ''
            }

        },
    };

</script>

<style lang="scss" scoped>

</style>
