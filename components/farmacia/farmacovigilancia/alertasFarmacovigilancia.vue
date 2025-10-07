<template>
    <div>
        <v-tabs centered color="white" icons-and-text>
            <v-tabs-slider color="primary"></v-tabs-slider>

            <v-tab href="#tab-1" class="black--text" v-if="$can('alertasFarmacovigilancia.mensajes')">
                Mensajes
            </v-tab>

            <v-tab href="#tab-2" class="black--text" v-if="$can('alertasFarmacovigilancia.tipoMensajes')"
                @click="getTipos()">
                Tipo de alerta
            </v-tab>

            <v-tab href="#tab-3" class="black--text">
                Parametrización de alertas
            </v-tab>

            <!-- Mensajes -->
            <v-tab-item :value="'tab-1'">
                <v-dialog v-model="dialogs.formMensaje" persistent max-width="700px">
                    <v-card>
                        <v-card-title class="titulo black--text">
                            Mensaje de Alerta
                        </v-card-title>
                        <form>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="datos.titulo" dense label="Titulo *"
                                            :error-messages="errors.titulo">
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="12" md="12">
                                        <v-textarea v-model="datos.mensaje" label="Mensaje *" dense
                                            :error-messages="errors.mensaje">
                                        </v-textarea>
                                    </v-col>
                                </v-row>

                                <p>Campos obligatorios *</p>

                                <v-card-actions class="justify-end">
                                    <v-btn color="error" small @click="cerrarModalMensaje()">cerrar</v-btn>
                                    <v-btn color="boton" small dark @click="guardarMensaje()"
                                        v-if="editar == false">Guardar</v-btn>
                                    <v-btn color="warning" small dark @click="editarMensaje()"
                                        v-if="editar == true">editar</v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </form>
                    </v-card>
                </v-dialog>

                <div>
                    <v-toolbar flat>
                        <v-spacer></v-spacer>
                        <v-btn v-if="$can('alertasFarmacovigilancia.crearMensaje')" color="success"
                            class="white--text ma-2 px-6" small
                            @click="dialogs.formMensaje = true, editar = false">Crear<v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-row class="mx-2">
                        <v-col md="5" lg="5" xl="5" sm="6" cols>
                            <v-text-field dense v-model="filtro.titulo" label="Titulo" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="5" lg="5" xl="5" sm="6" cols>
                            <v-text-field dense v-model="filtro.mensaje" label="Mensaje" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="2" lg="2" xl="2" sm="6" cols>
                            <v-btn-toggle background-color="white" dark small>
                                <v-btn v-if="$can('alertasFarmacovigilancia.mensajes')" small color="success"
                                    @click="getMensajes()">
                                    Filtrar</v-btn>
                                <v-btn v-if="$can('alertasFarmacovigilancia.mensajes')" small class="ml-2" color="error"
                                    @click="limpiar()">Limpiar</v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>
                </div>

                <v-divider class="mt-2"></v-divider>

                <v-data-table :headers="headersMensajes" :items="mensajes" hide-default-footer dense
                    loading-text="cargando..." no-data-text="Sin datos para mostrar">
                    <template v-slot:[`item.usuario.operador`]="{ item }">
                        {{
                            `${item.usuario?.operador?.nombre || ''} ${item.usuario?.operador?.apellido || ''}`.trim() ||
                            'Sin nombre'
                        }}
                    </template>
                    <template v-slot:[`item.estado`]="{ item }">
                        <v-chip small dark :color="item.estado.id == 1 ? 'success' : 'error'">{{
                            item.estado.nombre
                            }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.accion`]="{ item }">
                        <v-tooltip top v-if="$can('alertasFarmacovigilancia.actualizar')">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" small v-bind="attrs" v-on="on"
                                    @click="abrirModalEditarMensaje(item)">
                                    mdi-grease-pencil
                                </v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>

                        <v-tooltip top v-if="$can('alertasFarmacovigilancia.actualizar')">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon :color="item.estado.id == 1 ? 'error' : 'success'" small v-bind="attrs"
                                    v-on="on" @click="cambiarEstado(item.id)">
                                    mdi-account-convert
                                </v-icon>
                            </template>
                            <span>{{ item.estado.id == 1 ? 'Inactivar' : 'Activar' }}</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
                <v-row no-gutters>
                    <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                            @input="getMensajes()">
                        </v-pagination>
                    </v-col>
                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                            @change="getMensajes()">
                        </v-select>
                    </v-col>
                </v-row>
            </v-tab-item>

            <!-- Alertas Farmacoterapeuticas -->
            <v-tab-item :value="'tab-2'">
                <v-dialog v-model="dialogoTipo" persistent max-width="700px">
                    <v-card>
                        <v-card-title class="titulo black--text">
                            Tipo alerta
                        </v-card-title>
                        <form>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="datosAlerta.nombre" dense label="Nombre *"
                                            :error-messages="errorsTipo.nombre">
                                        </v-text-field>
                                    </v-col>
                                </v-row>

                                <p>Campos obligatorios *</p>

                                <v-card-actions class="justify-end">
                                    <v-btn color="error" small @click="cerrarModalTipo()">cerrar</v-btn>
                                    <v-btn color="boton" dark small @click="guardarTipo()"
                                        v-if="editarTipo == false">Guardar</v-btn>
                                    <v-btn color="warning" dark small @click="editarTipoAlerta()"
                                        v-if="editarTipo == true">editar</v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </form>
                    </v-card>
                </v-dialog>

                <div>
                    <v-toolbar flat>
                        <v-spacer></v-spacer>
                        <v-btn color="success" class="white--text ma-2 px-6" small
                            @click="dialogoTipo = true, editarTipo = false">
                            Crear<v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-toolbar>

                    <v-row class="mx-2">

                        <v-col cols="12" sm="12" md="6">
                            <v-text-field dense v-model="filtroTipo.nombre" label="Tipo" outlined>
                            </v-text-field>
                        </v-col>

                        <v-col md="2" lg="2" xl="2" sm="6" cols>
                            <v-btn-toggle background-color="white" dark>
                                <v-btn small color="success" @click="getTipos()">
                                    Filtrar</v-btn>
                                <v-btn small class="ml-2" color="error" @click="limpiarTipo()">Limpiar</v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>
                </div>

                <v-divider class="mt-2"></v-divider>

                <v-data-table :headers="headersTipo" :items="tipoAlerta" hide-default-footer dense
                    loading-text="cargando..." no-data-text="Sin datos para mostrar">
                    <template v-slot:[`item.user.operador`]="{ item }">
                        {{
                            `${item.user?.operador?.nombre || ''} ${item.user?.operador?.apellido || ''}`.trim() || 'Sin nombre'
                        }}
                    </template>
                    <template v-slot:[`item.estado`]="{ item }">
                        <v-chip small dark :color="item.estado.id == 1 ? 'success' : 'error'">{{
                            item.estado.nombre
                            }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.accion`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" small v-bind="attrs" v-on="on"
                                    @click="abrirModalEditarTipo(item)">
                                    mdi-grease-pencil
                                </v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon :color="item.estado.id == 1 ? 'error' : 'success'" small v-bind="attrs"
                                    v-on="on" @click="cambiarEstadoTipo(item.id)">
                                    mdi-account-convert
                                </v-icon>
                            </template>
                            <span>{{ item.estado.id == 1 ? 'Inactivar' : 'Activar' }}</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
                <v-row no-gutters>
                    <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                        <v-pagination v-model="paginaTipo" class="my-4" :length="totalTipo" :total-visible="9"
                            @input="getTipos()">
                        </v-pagination>
                    </v-col>
                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                        <v-select class="my-4" v-model="opcionActualTipo" :items="opcionesTipo" dense solo small
                            @change="getTipos()"></v-select>
                    </v-col>
                </v-row>
            </v-tab-item>
            <!-- Seguimiento Alertas -->
            <v-tab-item :value="'tab-3'">
                <v-container>
                    <v-row>
                        <v-col md="6">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-alert v-bind="attrs" v-on="on" border="left" color="info" dark text
                                        @click="alertaSeleccionada('principal')">
                                        <b>Nuevo principal</b>
                                    </v-alert>
                                </template>
                                <span>Haz clic aquí</span>
                            </v-tooltip>
                        </v-col>
                        <v-col md="6">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-alert v-bind="attrs" v-on="on" border="left" color="info" dark text
                                        @click="alertaSeleccionada('medicamento')">
                                        <b>Nuevo medicamento</b>
                                    </v-alert>
                                </template>
                                <span>Haz clic aquí</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="seleccionadaAlerta === 'principal'">
                        <v-col>
                            <v-btn color="primary" small @click="abrirDialogoPrincipal(false)">Nuevo Principal</v-btn>
                            <v-data-table disable-pagination hide-default-footer dense :headers="headersPrincipal"
                                :items="principales">
                                <template v-slot:[`item.usuario_registra.operador.nombre`]="{ item }">
                                    {{
                                        `${item.usuario_registra?.operador?.nombre || ''}
                                    ${item.usuario_registra?.operador?.apellido || ''}`.trim() || 'Sin nombre'
                                    }}
                                </template>
                                <template v-slot:[`item.estado.nombre`]="{ item }">
                                    <v-chip small dark :color="item.estado.id == 1 ? 'success' : 'error'">{{
                                        item.estado.nombre
                                        }}
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-icon color="warning" @click="abrirDialogoPrincipal(item)">
                                                mdi-grease-pencil
                                            </v-icon>
                                        </template>
                                        <span>Editar</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon :color="item.estado.id == 1 ? 'error' : 'success'" v-bind="attrs"
                                                v-on="on" @click="cambiarEstadoAlertas(item.id)">
                                                mdi-account-convert
                                            </v-icon>
                                        </template>
                                        <span>{{ item.estado.id == 1 ? 'Inactivar' : 'Activar' }}</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon @click="abrirDialogoNuevaAlerta(item, item.id)" color="blue"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert
                                            </v-icon>
                                        </template>
                                        <span> Agregar alerta </span>
                                    </v-tooltip>
                                </template></v-data-table>

                            <v-row no-gutters style="background-color: white;">
                                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                        @input="listarAlertaPrincipal"></v-pagination>
                                </v-col>
                                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                        @change="listarAlertaPrincipal()"></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row v-if="seleccionadaAlerta === 'medicamento'">
                        <v-col>

                            <v-data-table disable-pagination hide-default-footer dense :headers="headersMedicamentos"
                                :items="medicamentosAlertas">
                                <template v-slot:[`item.usuario_registra.operador`]="{ item }">
                                    {{
                                        `${item.usuario_registra?.operador?.nombre || ''}
                                    ${item.usuario_registra?.operador?.apellido || ''}`.trim() || 'Sin nombre'
                                    }}
                                </template>
                                <template v-slot:top>
                                    <v-toolbar flat>
                                        <v-btn color="primary" small @click="abrirDialogoMedicamento(false)">Nuevo
                                            Medicamento/Producto</v-btn>
                                        <v-divider class="mx-4" inset vertical></v-divider>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="8">
                                                <v-text-field v-model="filtroNombre"
                                                    label="Medicamento/Producto"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="4">
                                                <v-btn small color="success"
                                                    @click="listarAlertaMedicamentos()">Filtrar</v-btn>
                                                <v-btn small color="warning"
                                                    @click="filtroNombre = ''; listarAlertaMedicamentos()">Limpiar</v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-spacer></v-spacer>
                                    </v-toolbar>
                                </template>
                                <template v-slot:[`item.estado.nombre`]="{ item }">
                                    <v-chip small dark :color="item.estado.id == 1 ? 'success' : 'error'">{{
                                        item.estado.nombre }}
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-icon color="warning" @click="abrirDialogoMedicamento(item)">
                                                mdi-grease-pencil
                                            </v-icon>
                                        </template>
                                        <span>Editar</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon :color="item.estado.id == 1 ? 'error' : 'success'" v-bind="attrs"
                                                v-on="on" @click="cambiarEstadoAlertas(item.id)">
                                                mdi-account-convert
                                            </v-icon>
                                        </template>
                                        <span>{{ item.estado.id == 1 ? 'Inactivar' : 'Activar' }}</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon @click="abrirDialogoNuevaAlerta(item, item.id)" color="blue"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert
                                            </v-icon>
                                        </template>
                                        <span> Agregar alerta </span>
                                    </v-tooltip>
                                </template>

                            </v-data-table>
                            <v-row no-gutters style="background-color: white;">
                                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                    <v-pagination v-model="paginaMedicamentos" class="my-4" :length="total"
                                        :total-visible="9" @input="listarAlertaMedicamentos"></v-pagination>
                                </v-col>
                                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                    <v-select class="my-4" v-model="opcionActualMedicamentos" :items="opciones" dense
                                        solo small @change="listarAlertaMedicamentos"></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
        </v-tabs>

        <v-dialog v-model="dialogoMedicamentosAlerta" persistent max-width="600px">
            <v-card>
                <v-alert border="left" icon="mdi-hospital-box-outline" color="info" dark text>
                    {{ editarMedicamento ? `Vas a editar ${nombreMedicamento}` : 'Crear Medicamento / Producto' }}
                </v-alert>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete dense :search-input.sync="filtroCodesumis" :items="codesumis"
                                    item-text="nombre" item-value="id"
                                    no-data-text="Debe ingresar el nombre del medicamento o producto"
                                    label="Medicamento/Producto" v-model="codesumi_id">
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark @click="cerrarMedicamentosAlerta()" small color="red">Cancelar</v-btn>
                    <v-btn v-if="!editarMedicamento" small color="success" @click="crearMedicamento">Crear</v-btn>
                    <v-btn v-if="editarMedicamento" small color="warning" @click="actualizarMedicamento()">Actualizar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoPrincipioActivo" persistent max-width="600px">
            <v-card>
                <v-alert border="left" icon="mdi-hospital-box-outline" color="info" dark text>
                    {{ editarPrincipioActivo ? `Vas a editar ${nombreCum}` : 'Crear Principal' }}
                </v-alert>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <!-- <v-autocomplete :search-input.sync="filtroPrincipioActivo" :items="principiosActivos"
                  label="Nombre Principal" v-model="principal" item-text="codesumi.principio_activo" item-value="codesumi.principio_activo"
                  no-data-text="Debe ingresar el nombre del principio activo"></v-autocomplete> -->
                                <v-autocomplete label="Principios activos" dense outlined v-model="principal"
                                    :items="principiosCreados" item-text="nombre"></v-autocomplete>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark @click="cerrarMedicamentosAlerta()" small color="red">Cancelar</v-btn>
                    <v-btn v-if="!editarPrincipioActivo" small color="success" @click="crearPrincipal()">Crear</v-btn>
                    <v-btn v-if="editarPrincipioActivo" small color="warning" @click="actualizarPrincipio()">Actualizar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="nuevaAlerta" max-width="900px">
            <v-card>
                <v-alert prominent dense border="left" icon="mdi-alert-circle-check-outline" color="info" dark text>
                    <div class="d-flex align-center">
                        {{ `Agregar alerta para ${medicamentoAlerta}` }}

                        <v-btn @click="cerrarAlertaDetalle" outlined icon class="ml-auto" color="info">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-alert>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-autocomplete label="Mensaje" v-model="alertaMedicamento.mensaje_alerta_id"
                                :items="mensajes" item-text="titulo" item-value="id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="6" v-if="seleccionadaAlerta === 'principal'">
                            <!-- <v-autocomplete :search-input.sync="filtroPrincipioActivo2" :items="interacciones" label="Interaccion"
                v-model="alertaMedicamento.interaccion_id" item-text="codesumi.principio_activo" item-value="codesumi.principio_activo"
                no-data-text="Debe ingresar el nombre del principio activo"></v-autocomplete> -->
                            <v-autocomplete label="Interaccion" v-model="alertaMedicamento.interaccion_id"
                                :items="principiosCreados" item-text="nombre"
                                :loading="cargandoPrincipios"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-autocomplete v-model="alertaMedicamento.tipo_alerta_id" :items="tipoAlerta"
                                item-text="nombre" item-value="id" label="Tipo de alerta">
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="success" small @click="crearAlertaDetalleMedicamento()">Agregar</v-btn>
                    </v-card-actions>
                    <v-alert prominent dense border="left" icon="mdi-history" color="info" dark text>
                        {{ `Historico de alertas para ${medicamentoAlerta}` }}

                    </v-alert>
                    <v-data-table :loading="loading" dense :headers="headersHistorico" :items="historicoAlerta">
                        <template v-slot:[`item.estado.nombre`]="{ item }">
                            <v-chip small dark :color="item.estado.id == 1 ? 'success' : 'error'">{{
                                item.estado.nombre
                                }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon :color="item.estado.id == 1 ? 'error' : 'success'" v-bind="attrs" v-on="on"
                                        @click="cambiarEstadoDetalleAlertas(item.id)">
                                        mdi-account-convert
                                    </v-icon>
                                </template>
                                <span>{{ item.estado.id == 1 ? 'Inactivar' : 'Activar' }}</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="orange" v-bind="attrs" v-on="on"
                                        @click="abrirDialogoEditarMedicamentoAlerta(item)">
                                        mdi-pencil
                                    </v-icon>
                                </template>
                                <span>Editar</span>
                            </v-tooltip>

                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoEditarMedicamentoAlerta" persistent max-width="900px">
            <v-card>
                <v-alert prominent dense border="left" icon="mdi-pencil" color="info" dark text>
                    Editar alerta por medicamento
                </v-alert>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-autocomplete label="Mensaje" v-model="alertaMedicamento.mensaje_alerta_id"
                                :items="mensajes" item-text="titulo" item-value="id">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="6" v-if="seleccionadaAlerta === 'principal'">
                            <v-autocomplete :search-input.sync="filtroPrincipioActivo" :items="principiosActivos"
                                label="Interaccion" v-model="alertaMedicamento.interaccion_id"
                                item-text="codesumi.principio_activo" item-value="codesumi.principio_activo"
                                no-data-text="Debe ingresar el nombre del principio activo"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-autocomplete v-model="alertaMedicamento.tipo_alerta_id" :items="tipoAlerta"
                                item-text="nombre" item-value="id" label="Tipo de alerta">
                            </v-autocomplete>
                        </v-col>
                        <!-- <pre>{{ item }}</pre> -->
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" dark small @click="cerrarDetalleAlerta">cerrar</v-btn>
                        <v-btn color="warning" small @click="actualizarDetalle(alertaMedicamento.id)">Actualizar</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Preload -->
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
    </div>
</template>
<script>
// import DialogoMedicamento from '@/components/farmacia/farmacovigilancia/crearMedicamento.vue'
// import DialogoPrincipal from '@/components/farmacia/farmacovigilancia/crearPrincipal.vue';
import { mapActions } from "vuex";
export default {
    data() {
        return {
            filtroNombre: '',
            filtroTipo: {},
            value: 1,
            dialogoTipo: false,
            editarTipo: false,
            editarMedicamento: false,
            editarPrincipioActivo: false,
            loading: false,
            nuevaAlerta: false,
            medicamentosAlertas: [],
            pagina: 1,
            opcionActual: 10,
            total: 0,
            opciones: [5, 10, 15, 20],
            paginaMedicamentos: 1,
            opcionActualMedicamentos: 5,
            dialogoMedicamentosAlerta: false,
            codesumi_id: '',
            codesumis: [],
            dialogoPrincipioActivo: false,
            principales: [],
            filtroPrincipioActivo: null,
            filtroPrincipioActivo2: null,
            principal: '',
            filtroCodesumis: null,
            principiosActivos: [],
            historicoAlerta: [],
            medicamentoAlerta: '',
            interacciones: [],
            principiosCreados: [],
            dialogoEditarMedicamentoAlerta: '',
            alertaMedicamento: {
                mensaje_alerta_id: '',
                tipo_alerta_id: '',
                interaccion: ''
            },
            headersMensajes: [{
                text: 'Id',
                value: 'id',
                sortable: false,
            },
            {
                text: 'Titulo',
                value: 'titulo',
                sortable: false,
            },
            {
                text: 'Mensaje',
                sortable: false,
                value: 'mensaje'
            },
            {
                text: 'Usuario creador',
                sortable: false,
                value: 'usuario.operador'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado'
            },
            {
                text: 'Acciones',
                sortable: false,
                value: 'accion'
            },
            ],
            headersTipo: [{
                text: 'Id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre',
                sortable: false,
                value: 'nombre'
            },
            {
                text: 'Usuario creador',
                sortable: false,
                value: 'user.operador'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado'
            },
            {
                text: 'Acciones',
                sortable: false,
                value: 'accion'
            },
            ],
            tipoAlerta: [],
            mensajes: [],
            preload: false,
            opciones: [5, 10, 15, 20, 50, 100],
            opcionActual: 10,
            pagina: 1,
            total: 0,
            opcionesTipo: [5, 10, 15, 20, 50, 100],
            opcionActualTipo: 10,
            principalDialog: false,
            paginaTipo: 1,
            totalTipo: 0,
            nombreMedicamento: '',
            dialogs: {
                formMensaje: false,
            },
            datos: {
                titulo: '',
                mensaje: '',
            },
            datosAlerta: {
                nombre: '',
            },
            errorsTipo: {
                nombre: null,
            },
            errors: {
                titulo: null,
                mensaje: null,
            },
            filtro: {
                titulo: null,
                mensaje: null,
            },
            seleccionadaAlerta: null,
            cargandoPrincipios: false,
            headersPrincipal: [{
                text: 'Id',
                align: 'left',
                sortable: false,
                value: 'id'
            },
            {
                text: 'Principal',
                align: 'left',
                sortable: false,
                value: 'principal'
            },
            {
                text: 'Usuario creador',
                sortable: false,
                value: 'usuario_registra.operador.nombre'
            },

            {
                text: 'Estado',
                sortable: false,
                value: 'estado.nombre'
            },
            {
                text: 'Acciones',
                sortable: false,
                align: 'left',
                value: 'actions'
            }
            ],
            headersMedicamentos: [{
                text: 'Id',
                align: 'left',
                sortable: false,
                value: 'id'
            },
            {
                text: 'Medicamento/Producto',
                align: 'left',
                sortable: false,
                value: 'codesumi.nombre'
            },
            {
                text: 'Usuario creador',
                align: 'left',
                sortable: false,
                value: 'usuario_registra.operador'
            },
            {
                text: 'Estado',
                align: 'center',
                sortable: false,
                value: 'estado.nombre'
            },
            {
                text: 'Acciones',
                align: 'left',
                sortable: false,
                value: 'actions'
            }
            ],
            editar: false
        }
    },

    computed: {
        headersHistorico() {
            const headers = [{
                text: 'Id',
                sortable: false,
                value: 'id'
            },
            {
                text: 'Mensaje',
                sortable: false,
                value: 'mensaje_alerta.titulo'
            },
            {
                text: 'Tipo de alerta',
                sortable: false,
                value: 'tipo_alerta.nombre'
            },
            {
                text: 'Usuario creador',
                sortable: false,
                value: 'usuario_registra.operador.nombre'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado.nombre'
            },
            {
                text: 'Acciones',
                sortable: false,
                value: 'actions'
            }
            ];

            if (this.seleccionadaAlerta === 'principal') {
                headers.splice(3, 0, {
                    text: 'Interaccion',
                    value: 'interaccion'
                });
            }

            return headers;
        },
        alertaDetalleEstadoBloqueado() {
            let alerta = null;
            if (this.principales) {
                alerta = this.principales.find(alerta => alerta.id == this.alerta_id);
            }
            if (!alerta && this.medicamentosAlertas) {
                alerta = this.medicamentosAlertas.find(alerta => alerta.id == this.alerta_id);
            }
            return alerta ? alerta.estado.id == 2 : false;
        },

    },
    watch: {
        filtroCodesumis(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarCodesumis();
                } else if (val.length < 4) {
                    this.codesumis = null;
                }
            } else {
                this.codesumis = null;
            }
        },
        filtroPrincipioActivo(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarPrincipales(val);
                } else if (val.length < 4) {
                    this.principiosActivos = null;
                }
            } else {
                this.principiosActivos = null;
            }
        },
        filtroPrincipioActivo2(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarInteracciones(val);
                } else if (val.length < 4) {
                    this.interacciones = null;
                }
            } else {
                this.interacciones = null;
            }
        }
    },
    mounted() {
        this.getMensajes();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),
        getMensajes() {
            this.preload = true;
            this.$axios.post("/mensaje-alerta/listar?page=" + this.pagina + "&cant=" + this.opcionActual, this.filtro).then(
                res => {
                    this.mensajes = res.data.data;
                    this.total = res.data.last_page;
                    this.preload = false;
                }).catch(error => {
                    this.preload = false;
                    this.$toast.error(error.response.data.mensaje);
                });
        },

        alertaSeleccionada(alert) {
            this.seleccionadaAlerta = alert;
            if (alert === 'principal') {
                this.listarAlertaPrincipal();
            }
            if (alert === 'medicamento') {
                this.listarAlertaMedicamentos();
            }
        },
        abrirDialogoMedicamento(item) {
            this.listarPrincipales();
            this.editarMedicamento = !!item;
            if (this.editarMedicamento) {
                this.nombreMedicamento = item.codesumi.nombre;
                this.codesumi_id = item.codesumi_id;
                this.alerta_id = item.id;
            } else {
                this.codesumi_id = '';
            }
            this.dialogoMedicamentosAlerta = true;
        },

        abrirDialogoPrincipal(item) {
            this.editarPrincipioActivo = !!item;
            if (this.editarPrincipioActivo) {
                this.nombreCum = item.principal
                this.principal = item.principal;
                this.alerta_id = item.id;
            } else {
                this.principal = '';
            }
            this.listarPrincipios();
            this.dialogoPrincipioActivo = true;
        },
        getTipos() {
            // this.preload = true;
            this.$axios.post("/tipo-alerta/listar?page=" + this.paginaTipo + "&cant=" + this.opcionActualTipo, this
                .filtroTipo).then(
                    res => {
                        this.tipoAlerta = res.data.data;
                        this.totalTipo = res.data.last_page;
                        // this.preload = false;
                    }).catch(error => {
                        // this.preload = false;
                        this.$toast.error(error.response.data.mensaje);
                    });
        },

        abrirModalEditarMensaje(item) {
            this.datos = item;
            this.dialogs.formMensaje = true;
            this.editar = true

        },

        abrirModalEditarTipo(item) {
            this.datosAlerta = item;
            this.dialogoTipo = true;
            this.editarTipo = true
        },

        cerrarModalMensaje() {
            this.dialogs.formMensaje = false;
            this.datos.mensaje = ''
            this.datos.titulo = ''
            this.editar = false
            this.getMensajes()
        },

        cerrarModalTipo() {
            this.dialogoTipo = false;
            this.datosAlerta.nombre = ''
            this.editarTipo = false
            this.getTipos()
        },

        limpiar() {
            this.preload = true;
            for (const prop of Object.getOwnPropertyNames(this.filtro)) {
                this.filtro[prop] = null;
            }
            this.preload = false;
            this.getMensajes();
        },

        limpiarTipo() {
            this.preload = true;
            for (const prop of Object.getOwnPropertyNames(this.filtroTipo)) {
                this.filtroTipo[prop] = null;
            }
            this.preload = false;
            this.getTipos();
        },



        cambiarEstado(mensaje_id) {
            this.$swal({
                title: "Desea cambiarle el estado ha este mensaje?",
                text: "Al aceptar este mensaje, se realizara el cambio",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.value) {
                    this.preload = true;
                    this.$axios.put('/mensaje-alerta/cambiarEstado/' + mensaje_id).then(res => {
                        this.$toast.success(res.data.mensaje);
                        this.preload = false;
                        this.getMensajes()
                    }).catch(error => {
                        this.preload = false;
                        if (error.response.data.mensaje) {
                            this.$toast.error(error.response.data.mensaje);
                        }
                    });
                }
            });
        },

        cambiarEstadoTipo(tipo_id) {
            this.$swal({
                title: "Desea cambiarle el estado ha este tipo?",
                text: "Al aceptar este tipo, se realizara el cambio",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.value) {
                    this.preload = true;
                    this.$axios.put('/tipo-alerta/cambiarEstado/' + tipo_id).then(res => {
                        this.$toast.success(res.data.mensaje);
                        this.preload = false;
                        this.getTipos()
                    }).catch(error => {
                        this.preload = false;
                        if (error.response.data.mensaje) {
                            this.$toast.error(error.response.data.mensaje);
                        }
                    });
                }
            });
        },

        Error(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },

        errorTipo(errors) {
            for (const key in this.errorsTipo) {
                if (key in errors) {
                    this.errorsTipo[key] = errors[key].join(",");
                }
            }
        },

        guardarMensaje() {
            this.preload = true;
            this.$axios.post("/mensaje-alerta/crear", this.datos).then(res => {
                this.$toast.success(res.data.mensaje);
                this.preload = false;
                this.dialogs.formMensaje = false;
                this.datos.mensaje = null;
                this.datos.titulo = null;
                this.getMensajes();
            }).catch(error => {
                this.preload = false;
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje);
                } else if (error.response.data) {
                    this.Error(error.response.data);
                }
            });
        },

        guardarTipo() {
            this.preload = true;
            this.limpiarError()
            this.datosAlerta.user_id = this.$store.state.auth.usuario.id
            this.$axios.post("/tipo-alerta/crear", this.datosAlerta).then(res => {
                this.$toast.success(res.data.mensaje);
                this.preload = false;
                this.dialogoTipo = false;
                this.datosAlerta.nombre = null;
                this.getTipos();
                this.limpiarError()
            }).catch(error => {
                this.preload = false;
                if (error.response.data.mensaje) {
                    this.$toast.error(error.response.data.mensaje);
                } else if (error.response.data) {
                    this.errorTipo(error.response.data);
                }
            });
        },

        editarMensaje() {
            this.preload = true;
            this.$axios.put('/mensaje-alerta/actualizar/' + this.datos.id, this.datos).then(res => {
                this.cerrarModalMensaje()
                this.preload = false;
            }).catch(error => {
                this.preload = false;
                if (error.response.data.error) {
                    this.$toast.error(error.response.data.error)
                } else if (error.response.data) {
                    this.Error(error.response.data)
                }
            })
        },

        editarTipoAlerta() {
            this.preload = true;
            this.$axios.put('/tipo-alerta/actualizar/' + this.datosAlerta.id, this.datosAlerta).then(res => {
                this.cerrarModalTipo()
                this.preload = false;
            }).catch(error => {
                this.preload = false;
                if (error.response.data.error) {
                    this.$toast.error(error.response.data.error)
                } else if (error.response.data) {
                    this.errorTipo(error.response.data)
                }
            })
        },

        limpiarError() {
            for (const key in this.errorsTipo) {
                this.errorsTipo[key] = "";
            }
        },

        listarAlertaPrincipal() {
            this.preload = true;
            this.$axios.get(`/alertas/listarAlertasPrincipales?page=${this.pagina}&cantidad=${this.opcionActual}`)
                .then(res => {
                    this.principales = res.data.data;
                    this.total = res.data.last_page;
                    this.preload = false;
                })
                .catch(e => {
                    this.preload = false;
                    console.log('error', e);
                });
        },

        listarPrincipales(filtro) {
            this.preload = true;
            this.$axios.post('medicamentos/buscarPrincipioActivo', {
                principio_activo: this.filtroPrincipioActivo
            }).then(res => {
                this.principiosActivos = res.data;
                this.preload = false;
            }).catch(res => {
                console.log(res);
            });
        },

        listarInteracciones(filtro) {
            this.preload = true;
            this.$axios.post('medicamentos/buscarPrincipioActivo', {
                principio_activo: this.filtroPrincipioActivo2
            }).then(res => {
                this.interacciones = res.data;
                this.preload = false;
            }).catch(res => {
                console.log(res);
            });
        },
        listarAlertaMedicamentos() {
            this.setPreload(true);
            this.$axios.get(
                `/alertas/listarCodesumis?page=${this.paginaMedicamentos}&cantidad=${this.opcionActualMedicamentos}&codesumi=${this.filtroNombre}`)
                .then(res => {
                    this.medicamentosAlertas = res.data[0].data;
                    this.total = res.data[0].last_page;
                })
                .catch(e => {
                    console.log('error', e);
                }).finally(() => {
                    this.setPreload(false);
                })
        },

        listarCodesumis() {
            this.preload = true;
            this.$axios
                .post('/codesumis/buscar', {
                    nombre: this.filtroCodesumis,
                })
                .then((res) => {
                    this.codesumis = res.data;
                    this.preload = false;
                })
                .catch((e) => {
                    console.error(e.response);
                    this.preload = false;
                });
        },

        crearMedicamento() {
            if (!this.codesumi_id) {
                this.$toast.error('Debe seleccionar un medicamento');
                return;
            }
            this.preload = true;
            const payload = {
                codesumi_id: this.codesumi_id,
                estado_id: 1,
                usuario_registra_id: this.$store.state.auth.usuario.id,
            };
            this.$axios
                .post('alertas/crearAlertaMedicamento', payload)
                .then((res) => {
                    this.preload = false;
                    this.$toast.success('Alerta creada con éxito');
                    this.listarAlertaMedicamentos()
                    this.cerrarMedicamentosAlerta()
                })
                .catch((error) => {
                    this.preload = false;
                    this.$toast.error('Error al crear el medicamento');
                    console.error(error);
                });
        },

        actualizarMedicamento() {
            this.preload = true;
            const payload = {
                codesumi_id: this.codesumi_id,
                estado_id: 1,
                usuario_registra_id: this.$store.state.auth.usuario.id,
            };
            this.$axios.put(`/alertas/actualizar/${this.alerta_id}`, payload)
                .then((res) => {
                    this.preload = false;
                    this.$toast.success('Alerta actualizada con éxito');
                    this.listarAlertaMedicamentos();
                    this.cerrarMedicamentosAlerta();
                })
                .catch((error) => {
                    this.preload = false;
                    this.$toast.error
                    console.error(error);
                });
        },

        actualizarPrincipio() {
            this.preload = true;
            const payload = {
                principal: this.principal,
                estado_id: 1,
                usuario_registra_id: this.$store.state.auth.usuario.id,
            };
            this.$axios.put(`/alertas/actualizar/${this.alerta_id}`, payload)
                .then((res) => {
                    this.preload = false;
                    this.$toast.success('Alerta actualizada con éxito');
                    this.listarAlertaPrincipal();
                    this.cerrarMedicamentosAlerta();
                })
                .catch((error) => {
                    this.preload = false;
                    this.$toast.error
                    console.error(error);
                });
        },
        cerrarMedicamentosAlerta() {
            this.dialogoMedicamentosAlerta = false;
            this.dialogoPrincipioActivo = false;
            this.principal = '',
                this.codesumi_id = ''
        },

        crearPrincipal() {
            if (!this.principal) {
                this.$toast.error('Debe seleccionar un principio activo');
                return;
            }
            this.preload = true;
            const payload = {
                principal: this.principal,
                estado_id: 1,
                usuario_registra_id: this.$store.state.auth.usuario.id
            };
            this.$axios.post('alertas/crearAlertaPrincipal', payload)
                .then(res => {
                    this.preload = false;
                    this.$toast.success('Alerta creada')
                    this.listarAlertaPrincipal()
                    this.cerrarMedicamentosAlerta()
                })
                .catch(error => {
                    this.preload = false;
                    this.$toast.error('Error al crear el medicamento');
                    console.error(error);
                });
        },

        cambiarEstadoAlertas(codesumi_id) {
            this.$swal({
                title: "¿Desea cambiar el estado de esta alerta?",
                text: "Al aceptar se realizara el cambio de estado",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.value) {
                    this.preload = true;
                    this.$axios.put('/alertas/cambiarEstado/' + codesumi_id).then(res => {
                        this.$toast.success(res.data.mensaje);
                        this.preload = false;
                        this.listarAlertaMedicamentos()
                        this.listarAlertaPrincipal()
                    }).catch(error => {
                        this.preload = false;
                        if (error.response.data.mensaje) {
                            this.$toast.error(error.response.data.mensaje);
                        }
                    });
                }
            });
        },

        cambiarEstadoDetalleAlertas(detalle_id) {
            if (this.alertaDetalleEstadoBloqueado) {
                this.$swal({
                    title: "Error",
                    text: "No se puede cambiar el estado de la alerta porque la alerta principal se encuentra inactiva",
                    type: "error",
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Aceptar",
                });
                return;
            }

            this.$swal({
                title: "¿Desea cambiar el estado de esta alerta?",
                text: "Al aceptar se realizara el cambio de estado",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.value) {
                    this.preload = true;
                    this.$axios.put('/alertas-detalles/cambiarEstado/' + detalle_id).then(res => {
                        this.$toast.success('Estado cambiado con éxito');
                        this.cerrarAlertaDetalle()
                        this.preload = false;
                    }).catch(error => {
                        this.preload = false;
                        if (error.response.data.mensaje) {
                            this.$toast.error(error.response.data.mensaje);
                        }
                    });
                }
            });
        },
        crearAlertaDetalleMedicamento() {
            this.preload = true;
            const payload = {
                tipo_alerta_id: this.alertaMedicamento.tipo_alerta_id,
                mensaje_alerta_id: this.alertaMedicamento.mensaje_alerta_id,
                estado_id: 1,
                usuario_registra_id: this.$store.state.auth.usuario.id,
                alerta_id: this.alerta_id,
                interaccion: this.alertaMedicamento.interaccion_id
            };
            this.$axios.post('alertas-detalles/crearAlertaDetalle', payload)
                .then(res => {
                    this.preload = false;
                    this.$toast.success('Alerta creada con éxito')
                    this.cerrarAlertaDetalle()
                })
                .catch(error => {
                    this.preload = false;
                    this.$toast.error('Error al crear el medicamento');
                    console.error(error);
                });
        },
        abrirDialogoNuevaAlerta(item, alerta_id) {
            this.HistoricoAlertas(alerta_id);
            this.getTipos();
            this.nuevaAlerta = true;
            this.alerta_id = item.id;
            this.medicamentoAlerta = this.seleccionadaAlerta === 'medicamento' ? item.codesumi.nombre : item.principal;
            this.listarPrincipios();
        },

        HistoricoAlertas(alerta_id) {
            this.loading = true;
            this.$axios.get(`/alertas-detalles/historialAlerta/${alerta_id}`).then(
                res => {
                    this.historicoAlerta = res.data
                    this.loading = false
                }
            ).catch(err => {
                this.loading = false
                console.log(err)
            })
        },
        cerrarAlertaDetalle() {
            this.nuevaAlerta = false,
                this.preload = false,
                this.HistoricoAlertas(this.alerta_id)
        },

        abrirDialogoEditarMedicamentoAlerta(item) {
            this.alertaMedicamento = {
                ...item,
                tipo_alerta_id: item.tipo_alerta_id ? parseInt(item.tipo_alerta_id, 10) : null,
                mensaje_alerta_id: item.mensaje_alerta_id ? parseInt(item.mensaje_alerta_id, 10) : null,
                interaccion_id: item.interaccion_id ? parseInt(item.interaccion_id, 10) : null
            };
            this.dialogoEditarMedicamentoAlerta = true;
        },

        actualizarDetalle(id) {
            this.preload = true;
            const payload = {
                alerta_id: this.alerta_id,
                mensaje_alerta_id: this.alertaMedicamento.mensaje_alerta_id,
                tipo_alerta_id: this.alertaMedicamento.tipo_alerta_id,
                estado_id: 1,
                id: this.alertaMedicamento.id,
                usuario_registra_id: this.$store.state.auth.usuario.id,
                interaccion: this.alertaMedicamento.interaccion_id
            };
            this.$axios.put(`/alertas-detalles/actualizar/${id}`, payload)
                .then((res) => {
                    this.preload = false;
                    this.dialogoEditarMedicamentoAlerta = false,
                        this.HistoricoAlertas(this.alerta_id)
                    this.$toast.success('Alerta actualizada con éxito');

                })
                .catch((error) => {
                    this.preload = false;
                    this.$toast.error
                    console.error(error);
                });
        },
        cerrarDetalleAlerta() {
            this.dialogoEditarMedicamentoAlerta = false;
        },

        listarPrincipios() {
            this.cargandoPrincipios = true;
            this.$axios.get('principios-activos/listar').then((res) => {
                this.principiosCreados = res.data
            }).catch((error) => {
                console.error(error)
                this.$toast.error('Error al listar')
            }).finally(() => {
                this.cargandoPrincipios = false;
            })
        },

    }
}

</script>
