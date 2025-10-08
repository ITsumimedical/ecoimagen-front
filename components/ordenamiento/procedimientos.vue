<template>
	<v-row>

		<v-dialog v-model="modalEmail" persistent max-width="600px">
			<v-card>
				<v-card-title>
					<span class="text-h5">Enviar Orden</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12" sm="12" md="12">
								<v-text-field v-model="emailEnvio" label="Email" required></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error"
						@click="emailEnvio = null; datosEnvioEmail = null; modalEmail = false;">Cerrar</v-btn>
					<v-btn color="success" @click="SendEmail()">Enviar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-col cols="12" sm="12" md="10" class="pt-1 pb-1">
			<v-autocomplete dense outlined v-model="formProcedimientos.procedimiento" :loading="preload"
				:search-input.sync="FiltroCups" :items="cups" item-text="cups"
				:no-data-text="preload ? 'Buscando...' : 'Debe ingresar el nombre o el código CUPS del procedimiento'"
				return-object label="Debe ingresar el nombre o el código CUPS del procedimiento">
			</v-autocomplete>
		</v-col>

		<v-col cols="12" sm="12" md="2" class="pt-1 pb-1">
			<v-text-field dense outlined v-model="formProcedimientos.cantidad" type="number" :min="0" :rules="[valor => valor >= 1 || 'La cantidad no puede ser negativa o cero']"
				@input="validarCantidad"
				label="Cantidad"></v-text-field>
		</v-col>
		<v-col cols="12" sm="12" md="3" class="pt-1 pb-1">
			<v-menu ref="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
				min-width="auto">
				<template v-slot:activator="{ on, attrs }">
					<v-text-field dense outlined v-model="formProcedimientos.fechaVigencia" label="Vigencia Desde"
						prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
				</template>
				<v-date-picker v-model="formProcedimientos.fechaVigencia" @input="menu = false" :min="today">
				</v-date-picker>
			</v-menu>
		</v-col>
		<v-col cols="12" sm="12" md="9" class="pt-1 pb-1">
			<v-text-field dense outlined label="Observación" v-model="formProcedimientos.observacion"></v-text-field>
		</v-col>
		<v-col cols="12" sm="12" md="12" class="pt-1 pb-1 d-flex justify-end">
            <v-btn small color="warning" class="mr-4" @click="limpiarFormulario()">Limpiar</v-btn>
			<v-btn small color="success" class="mr-4" @click="agregarprocedimientos()">Agregar</v-btn>
		</v-col>

		<v-col cols="12" sm="12" md="12">
			<v-card>
				<v-data-table :headers="headers" :items="procedimientosSeleccionados"
					no-data-text="Aún no hay servicios preordenados disponibles para este afiliado.">
					<template v-slot:[`item.rep.nombre`]="{ item }">
						<v-btn text @click="modalDialogoPreOrden(item)">
							{{ item.rep.nombre == null ? 'Sin Direccionamiento' : item.rep.nombre }}
						</v-btn>
					</template>
					<template v-slot:[`item.autorizacion`]="{ item }">
						<td class="text-center">{{ parseInt(item.procedimiento.requiere_auditoria) === 1 ? 'Si' : 'No'
						}}</td>
					</template>
					<template v-slot:[`item.eliminar`]="{ index }">
						<td class="text-center">
							<v-btn class="mx-2" fab dark small color="error"
								@click="procedimientosSeleccionados.splice(index, 1)">
								<v-icon dark>mdi-close</v-icon>
							</v-btn>
						</td>
					</template>
                    <template v-slot:[`item.codigo`]="{ item }">
                        {{ item.procedimiento?.codigo || item.codigo }}
                    </template>

                    <template v-slot:[`item.nombre`]="{ item }">
                        {{ item.procedimiento?.nombre || item.nombre }}
                    </template>
					<!-- <template v-slot:[`item.imprimir`]="{ item }">
						<td class="text-center">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn v-bind="attrs" v-on="on" class="mx-2" fab dark small color="info"
										@click="imprimirRecomendacion(item)">
										<v-icon dark>mdi-download-circle-outline</v-icon>
									</v-btn>
								</template>
								<span>Recomendaciones</span>
							</v-tooltip>
						</td>
					</template> -->
                    <template v-slot:[`item.cantidad`]="{ item }">
                    <v-text-field
                        v-model="item.cantidad"
                        type="number"
                        min="1"
                        dense
                        hide-details
                        style="max-width: 80px;"
                    />
                    </template>

                    <template v-slot:[`item.fechaVigencia`]="{ item }">
                    <v-text-field
                        v-model="item.fechaVigencia"
                        type="date"
                        dense
                        hide-details
                        style="max-width: 140px;"
                    />
                    </template>

                    <template v-slot:[`item.observacion`]="{ item }">
                    <div class="d-flex justify-space-between align-center">
                        <span style="white-space: normal; max-width: 220px; word-break: break-word;">
                        {{ item.observacion || 'Sin observación' }}
                        </span>
                        <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-bind="attrs" v-on="on" @click="abrirEditorObservacion(item)">
                            <v-icon small color="warning">mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span>Editar observación</span>
                        </v-tooltip>
                    </div>
                    </template>

				</v-data-table>
			</v-card>
		</v-col>
		<v-col cols="12" sm="12" md="12" class="pt-1 pb-1" align="right">
			<v-btn v-if="procedimientosSeleccionados.length > 0" color="primary" class="mr-4" small
				@click="generarOrdenamiento()">
				Ordenar
			</v-btn>
		</v-col>

		<v-col cols="12" sm="12" md="12">
			<v-data-table :loading="loading" :items-per-page="-1" :disabled="loading" :headers="headersOrdenesActivas"
				:items="ordenesActivas" hide-default-footer no-data-text="No hay órdenes activas ni pendientes de autorización registradas.">
				<template v-slot:[`item.direccionamiento_id`]="{ item }">
					<v-btn text @click="modalDialogo(item)">
						{{ item.rep_id == null ? 'Sin Direccionamiento' : item.rep.nombre }}
					</v-btn>
				</template>
				<template v-slot:[`item.estado`]="{ item }">
					<td>
						<v-chip label v-if="parseInt(item.estado_id) === 1 || parseInt(item.estado_id) === 4" color="success">
							{{ item.estado.nombre }}</v-chip>
						<v-chip label v-else-if="parseInt(item.estado_id) === 3" color="warning">{{ item.estado.nombre
						}}</v-chip>
						<v-chip label v-else-if="parseInt(item.estado_id) === 5" color="error">{{ item.estado.nombre
						}}</v-chip>
					</td>
				</template>
				<template v-slot:[`item.imprimir`]="{ item }">
					<td class="text-center">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-btn v-if="item.estado_id != 3" icon color="blue" v-on="on" @click="imprimir(item)">
									<v-icon>mdi-file-download</v-icon>
								</v-btn>
							</template>
							<span>Descargar</span>
						</v-tooltip>
						<v-tooltip v-if="item.estado_id != 3">
							<template v-slot:activator="{ on }">
								<v-btn icon color="warning" v-on="on"
									@click="datosEnvioEmail = item; modalEmail = true">
									<v-icon>mdi-email-fast </v-icon>
								</v-btn>
							</template>
							<span>Enviar Correo</span>
						</v-tooltip>
					</td>
				</template>
			</v-data-table>
		</v-col>
		<v-dialog v-model="modalConsentimiento" v-if="modalConsentimiento">
			<v-card>
				<v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">
					<b>CONSENTIMIENTO INFORMADO</b></v-alert>
				<v-card-text>
					<v-form ref="form" lazy-validation v-model="valid">
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<v-select :items="['Paciente', 'Representante Legal']" v-model="criterios.firmante"
									label="¿Firma el Paciente o el Representante legal?"
									:rules="firmanteRules"></v-select>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<v-Text-Field v-if="criterios.firmante == 'Representante Legal'"
									v-model="criterios.documentoRepresentante"
									label="Numero de Documento del Representante Legal" :rules="representanteRules">
								</v-Text-Field>
							</v-col>
							<br>
							<v-col cols="12" sm="12" md="12">
								<span><b>DESCRIPCIÓN</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.descripcion }}</p>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span><b>BENEFICIOS</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.beneficios }}</p>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span><b>RIESGOS</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.riesgos }}</p>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span><b>ALTERNATIVAS DISPONIBLES AL PROCEDIMIENTO</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.alternativas }}</p>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span><b>RIESGO DE NO ACEPTAR EL PROCEDIMIENTO</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.riesgo_no_aceptar }}</p>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span><b>¿QUÉ HACER SI NECESITA MÁS INFORMACIÓN?</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.informacion }}</p>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span><b>RECOMENDACIONES</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<p style="white-space: pre-wrap;">{{ infoConsentimiento.recomendaciones }}</p>
							</v-col>
							<v-row v-if="infoConsentimiento.odontologia === true">
								<v-col cols="12" sm="12" md="12">
									<v-divider></v-divider>
									<v-select :items="['Si', 'No']" v-model="criterios.embarazo"
										label="¿Es usuaria en embarazo?">
									</v-select>
								</v-col>

								<v-col cols="12">
									<v-alert class="text-center" dense text outlined type="info"
										icon="mdi-tooth"><b>Registrar
											dientes del usuario</b></v-alert>

								</v-col>
								<v-col cols="12" sm="12" md="4">
									<v-text-field v-model="datosDientes.diente" label="N° Diente"></v-text-field>
								</v-col>
								<v-col cols="12" sm="12" md="4">
									<v-text-field v-model="datosDientes.fecha" type="date" label="Fecha"></v-text-field>

								</v-col>
								<v-col cols="12" sm="12" md="4">
									<v-btn color="success" @click="guardarDiente()">Agregar diente</v-btn>

								</v-col>
								<v-col cols="12">
									<v-data-table :items="dientesOdontologia" dense density="compact"
										:headers="[{ text: 'Diente', align: 'center', value: 'diente' }, { text: 'Fecha', align: 'center', value: 'fecha' }, { text: 'Eliminar', align: 'center', value: 'eliminar' }]"
										hide-default-footer no-data-text="Sin datos registrados"
										:items-per-page="dientesOdontologia.length">
										<template v-slot:[`item.eliminar`]="{ item }">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-bind="attrs" v-on="on" class="mx-2" fab dark small
														color="info" @click="eliminarDiente(item)">
														<v-icon dark>mdi-delete</v-icon>
													</v-btn>
												</template>
												<span>Eliminar diente</span>
											</v-tooltip>
										</template>
									</v-data-table>

								</v-col>
								<v-col cols="12">
									<v-divider></v-divider>
								</v-col>
							</v-row>
							<v-col cols="12" sm="12" md="12">
								<span><b>DECLARACIÓN DE CONSENTIMIENTO INFORMADO:</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span v-if="criterios.firmante == 'Representante Legal'">En caso de realización de
									procedimiento en menor de edad o persona en condición de
									discapacidad,
								</span>
								<v-Text-Field v-if="criterios.firmante == 'Representante Legal'"
									v-model="criterios.nombre_representante" label="Nombre del Representante Legal">
								</v-Text-Field>
								<span>
									<b>a)</b> Declaro que he entendido las condiciones y objetivos del procedimiento que
									se
									me va a
									practicar, los cuidados que debo tener antes y después,
									manifiesto que la información recibida ha sido en un lenguaje claro y sencillo, y me
									ha
									dado la oportunidad de preguntar y resolver las dudas a
									satisfacción; comprendo y acepto el alcance y los riesgos que conlleva el
									procedimiento
									que me indican, por lo que manifiesto sentirme
									satisfecho(a) con la información recibida:
								</span>
								<v-autocomplete :items="['SI', 'NO']" v-model="criterios.declaracion_a" :rules="aRules">
								</v-autocomplete>
								<span>
									<b>b)</b> El profesional me ha planteado la posibilidad de participar en estudios
									investigativos que adelanta la institución con fines de mejoramiento
									continuo, me ha explicado que en caso de que sea sujeto de investigación mis datos
									serán
									empleados guardando estricta confidencialidad,
									asimismo existe posibilidad de que se tomen registros fotográficos y/o audiovisuales
									en
									el proceso con fines exclusivamente académicos, por lo
									que manifiesto sentirme satisfecho(a) con la información recibida y aceptarlo:
								</span>
								<v-autocomplete :items="['SI', 'NO']" v-model="criterios.declaracion_b" :rules="bRules">
								</v-autocomplete>
								<span>
									<b>c)</b> Por lo anteriormente dicho, y en pleno uso de mis facultades, autorizo al
									equipo de
									salud de la Sumimedical S.A.S. para que se me realice el
									procedimiento arriba descrito (o a mi representado según el caso) el cual fue
									solicitado
									por mi médico tratante. Entiendo y asumo los riesgos
									relacionados con la realización de este y autorizo a que se tomen las medidas
									necesarias
									ante cualquier complicación derivada del procedimiento.
								</span>
								<v-autocomplete :items="['SI', 'NO']" v-model="criterios.declaracion_c" :rules="cRules">
								</v-autocomplete>
							</v-col>
							<br>
							<v-col cols="12" sm="12" md="12">
								<span><b>NOTA:</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<span> como paciente, usted tiene derecho a retractarse de este consentimiento informado
									en
									cualquier momento antes o durante la realización de
									la intervención.
								</span>
							</v-col>

							<v-col cols="12" sm="12" md="12">
								<v-select :items="['Si', 'No']" v-model="criterios.aceptacion"
									label="¿Acepta el Consenimiento Informado?" :rules="aceptaRules">
								</v-select>
							</v-col>
							<br>
							<v-col cols="12" sm="12" md="12" v-if="criterios.aceptacion == 'No'">
								<span><b>DISENTIMIENTO O DESISTIMIENTO INFORMADO:</b></span>
							</v-col>
							<v-col cols="12" sm="12" md="12" v-if="criterios.aceptacion == 'No'">
								<span> En el presente documento manifiesto que he sido informado sobre mi condición, las
									eventuales complicaciones y/o riesgos que se deriven, los
									beneficios de los procedimientos planeados, de manera que se puedan tomar decisiones
									informadas; no obstante, reunido con el profesional<v-Text-Field
										v-model="criterios.nombre_profesional">
									</v-Text-Field> decido de forma libre y consciente no aceptar/revocar la realización
									del
									procedimiento propuesto, haciéndome responsable de las consecuencias que puedan
									derivarse de esta decisión.
								</span>
							</v-col>
						</v-row>

						<v-row>
							<v-col cols="12" sm="12" md="3">
								<div>
									<video ref="video"></video>
								</div>

							</v-col>
							<v-col cols="12" sm="12" md="3">
								<canvas ref="canvas" :width="330" :height="165"></canvas>
							</v-col>
							<v-col cols="12" sm="12" md="3">

							</v-col>


							<!-- <v-col cols="12" sm="12" md="6">
								<v-btn @click="tomarFoto()" color="primary">Tomar foto</v-btn>
							</v-col> -->
							<v-col cols="12" sm="12" md="12">
								<div class="firma mb-5">
									<h4 class="ml-3">Firma del paciente</h4>
									<vueSignature width="100%" height="200px" ref="firmaPaciente" />
									<v-btn text @click="limpiar()">Limpiar</v-btn>
								</div>
							</v-col>
						</v-row>

					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="modalConsentimiento = false">
						Cancelar
					</v-btn>
					<v-btn @click="submit()" dark color="success">Firmar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="dialogoDireccionamiento" persistent width="550">
			<v-card>
				<v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked"> Cambio
					de
					Direccionamiento</v-alert>
				<v-card-text>
					<v-autocomplete no-data-text="Cargando ..." dense v-model="rep_id" :items="listaPrestadores"
						item-text="nombre" :loading="loading" item-value="id" label="Prestador*">
					</v-autocomplete>
					<!-- Mostrar el mensaje si listaPrestadores está vacío -->
					<v-alert v-if="listaPrestadores.length === 0" type="info" dense text>
						Este cups no se encuentra parametrizado en ningun contrato
					</v-alert>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="dialogoDireccionamiento = false">
						Cancelar
					</v-btn>
					<v-btn @click="asignarDireccionamiento()" dark color="success">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
        <v-dialog v-model="dialogObservacion" max-width="600px">
            <v-card>
                <v-card-title>
                <v-icon left>mdi-comment-edit</v-icon>Actualizar observación
                </v-card-title>
                <v-card-text>
                <v-textarea
                    v-model="observacionTemporal"
                    label="Observación"
                    auto-grow
                    outlined
                    rows="3"
                    counter="500"
                />
                </v-card-text>
                <v-card-actions>
                <v-spacer />
                <v-btn small color="error" @click="dialogObservacion = false">Cancelar</v-btn>
                <v-btn small color="success" @click="guardarObservacion">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
	</v-row>
</template>
<script>
import vueSignature from "vue-signature";
import { mapActions } from "vuex";
import can from "~/plugins/can";

export default {
	components: {
		vueSignature,
	},
	middleware({
		$can,
		redirect
	}) {
		if (!$can('blog.vista')) {
			return redirect('/');
		}
	},
	name: 'procedimientos',
	mounted() {
		// this.listaCups();
		this.procedimientosActivos();
		// this.iniciarCamara();
	},
	props: ['consulta', 'afiliado'],
	data: () => ({
		valid: true,
		firmanteRules: [
			v => !!v || 'Campo requerido, por favor, diligenciar para poder continuar'
		],
		aRules: [
			v => !!v || 'Campo requerido, por favor, diligenciar para poder continuar'
		],
		bRules: [
			v => !!v || 'Campo requerido, por favor, diligenciar para poder continuar'
		],
		cRules: [
			v => !!v || 'Campo requerido, por favor, diligenciar para poder continuar'
		],
		aceptaRules: [
			v => !!v || 'Campo requerido, por favor, diligenciar para poder continuar'
		],
		rep_id: '',
		datosEnvioEmail: null,
		emailEnvio: null,
		modalEmail: false,
		preload: false,
		menu: false,
		procedimientosSeleccionados: [],
		procedimientos: [],
		ordenesActivas: [],
		prestadores: [],
		prestador: null,
		prestador2: null,
		dialogoDireccionamientoPreOrden: false,
		direccionamientoPreOrden: [],
		cups_consentimiento_id: null,
		dialogoDireccionamiento: false,
		modalConsentimiento: false,
		dientesOdontologia: [],
		datosDientes: {
			diente: null,
			fecha: null
		},
        dialogObservacion: false,
        observacionTemporal: '',
        itemObservacion: null,
		loading: false,
		direccionamiento: {
			rep_id: null
		},
		headers: [{
			text: 'Codigo',
			align: 'left',
			value: 'codigo'
		},
		{
			text: 'Descripción',
			align: 'left',
			value: 'nombre'
		},
		{
			text: 'Cantidad',
			align: 'center',
			value: 'cantidad'
		},
		{
			text: 'Vigencia Desde',
			align: 'center',
			value: 'fechaVigencia'
		},
		{
			text: 'Observación',
			align: 'left',
			value: 'observacion'
		},
		{
			text: 'Autorización',
			align: 'center',
			value: 'autorizacion'
		},
		{
			text: '',
			align: 'center',
			value: 'eliminar'
		},
		],
		headersOrdenesActivas: [{
			text: 'Codigo',
			value: 'cup.codigo'
		},
		{
			text: 'Nombre',
			value: 'cup.nombre'
		},
		{
			text: 'Cantidad',
			align: 'center',
			value: 'cantidad'
		},
		{
			text: 'Direccionamiento',
			align: 'center',
			value: 'direccionamiento_id'
		},
		{
			text: 'Fecha vigencia',
			align: 'center',
			value: 'fecha_vigencia'
		},
		{
			text: 'Estado',
			align: 'center',
			value: 'estado'
		},
		{
			text: '',
			align: 'center',
			value: 'imprimir'
		},
		],
		acepta: false,
		formProcedimientos: {
			cantidad: null,
			procedimiento: null,
			rep: null,
			fechaVigencia: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0,
				10),
			observacion: null,
		},
		today: new Date().toISOString().split('T')[0],
		cups: null,
		FiltroCups: null,
		ordenamientoId: null,
		criterios: {
			aceptacion: 'Si',
			firmante: null,
			documentoRepresentante: null,
			declaracion_a: 'SI',
			declaracion_b: 'SI',
			declaracion_c: 'SI',
			nombre_profesional: null,
			nombre_representante: null,
			embarazo: null
		},
		// camara: {
		//     width: 400,
		//     height: 200
		// },
		infoConsentimiento: {

		},
		listaPrestadores: [],
		ordenId: null
	}),
	watch: {
		FiltroCups(val) {
			if (val) {
				if (val.length === 4) {
					this.listaCups();
				} else if (val.length < 4) {
					this.cups = null;
				}
			} else {
				this.cups = null;
			}
		},
		prestador2(val) {
			if (val) {
				if (val.length === 6) {
					this.listarPrestadores2();
				} else if (val.length < 6) {
					this.listaPrestadores = null;
				}
			} else {
				this.listaPrestadores = null;
			}
		},
		index: -1
	},

	methods: {
		...mapActions('app', ['setPreload']),

		validarCantidad(valor) {
			if (valor < 1) {
				this.formProcedimientos.cantidad = 1;
			}
		},

		listaCups() {
			this.preload = true;
			this.$axios.post('/cup/buscarCupsNombre', {
				nombre: this.FiltroCups,
				idAfiliado: this.afiliado.id
			}).then(res => {
				this.cups = Object.values(res.data);
				this.preload = false;
			}).catch(e => {
				e.response
				this.preload = false;
			})
		},
		agregarprocedimientos() {
			if (!this.formProcedimientos.observacion || !this.formProcedimientos.cantidad || !this.formProcedimientos
				.procedimiento) {
				return this.$toast.error('Todos los campos son obligatorios');
			}
			this.preload = true;
			this.$axios.post('/ordenamiento/validar-periodicidad/' + this.consulta, this.formProcedimientos).then(response => {
				if (response.data.valido) {
					let data = {};
					this.formProcedimientos.rep = this.afiliado.ips
					for (const val in this.formProcedimientos) {
						data[val] = this.formProcedimientos[val]
					}
					this.procedimientosSeleccionados.push(data);
					this.limpiarFormulario();
				} else {
					this.$swal({
						title: "Atención",
						text: response.data.mensaje,
						type: "error",
					});
				}
			}).catch(e => console.log(e)).finally(() => this.preload = false)
		},
		limpiarFormulario() {
			for (const prop of Object.getOwnPropertyNames(this.formProcedimientos)) {
				this.formProcedimientos[prop] = null;
			}
			this.formProcedimientos.fechaVigencia = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
				.toISOString().substr(0, 10);
		},
		procedimientosActivos() {
			this.loading = true;
			this.$axios.$get('/ordenamiento/ordenes-activas/' + this.consulta + '/2').then(res => {
				this.ordenesActivas = res;
				this.loading = false;
			})
		},
		listarPrestadores(cup_id, entidad_id) {
			this.loading = true;
			this.$axios
				.post("direccionamiento/cambio-direccionamiento", {
					cup_id: cup_id,
					entidad_id: entidad_id,
					tipo: 2
				})
				.then((res) => {
					this.loading = false;
					this.listaPrestadores = res.data.map((rep) => {
						return {
							id: rep.id,
							nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
						};
					});
				})
				.catch((e) => {
					this.loading = false;
					console.log(e);
				});
		},

		listarPrestadores2() {
			this.preload = true;
			this.$axios.post('reps/listar?page=0', {
				prestador: this.prestador2
			}).then(res => {
				this.preload = false;
				this.listaPrestadores = res.data.map((rep) => {
					return {
						id: rep.id,
						nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
					}
				})
			}).catch(e => {
				this.preload = false;
				console.log(e);
			})
		},
		//evaluar condiciones cups

		// async evaluarCondicionesEntidad() {
		//   try {
		//     const requiereDiagnostico = await this.eveluarRequiereDiagnostico();
		//     if (!requiereDiagnostico) return;



		//     this.generarOrdenamiento()

		//   } catch (error) {
		//     this.$toast.error('Ocurrió un error al evaluar los condiciones')
		//   }
		// },

		async eveluarRequiereDiagnostico() {
			const idsProcedimientos = this.procedimientosSeleccionados.map(item => ({
				id: item.procedimiento.id,
				cantidad: parseInt(item.cantidad, 10)
			}));

			const data = {
				procedimientos: idsProcedimientos.map(p => p.id),
				cantidad: idsProcedimientos.reduce((acc, p) => {
					acc[p.id] = p.cantidad;
					return acc;
				}, {}),
				consulta_id: this.consulta
			};
			try {
				this.preload = true;
				const response = await this.$axios.post('/cup/evaluar-requiere-diagnostico', data)
				if (response.data === true) {
					return true
				} else {
					this.$swal({
						title: 'No se puede ordenar los servicios',
						text: response.data,
						type: 'error',
						showConfirmButton: true
					})
					return false;
				}
			} catch (error) {
				this.$toast.error('ocurrio un error al realizar la validacion');
				return false;
			} finally {
				this.preload = false
			}
		},

		agregarprocedimientos() {
			if (!this.formProcedimientos.observacion || !this.formProcedimientos.cantidad || !this.formProcedimientos
				.procedimiento) {
				return this.$toast.error('Todos los campos son obligatorios');
			}
			let data = {};
			this.formProcedimientos.rep = this.afiliado.ips
			for (const val in this.formProcedimientos) {
				data[val] = this.formProcedimientos[val]
			}
			this.procedimientosSeleccionados.push(data);
			this.limpiarFormulario();
		},

		limpiarFormulario() {
			for (const prop of Object.getOwnPropertyNames(this.formProcedimientos)) {
				this.formProcedimientos[prop] = null;
			}
			this.formProcedimientos.fechaVigencia = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
				.toISOString().substr(0, 10);
		},

		listarPrestadores(cup_id, entidad_id) {
			this.loading = true;
			this.$axios
				.post("direccionamiento/cambio-direccionamiento", {
					cup_id: cup_id,
					entidad_id: entidad_id,
					tipo: 2
				})
				.then((res) => {
					this.loading = false;
					this.listaPrestadores = res.data.map((rep) => {
						return {
							id: rep.id,
							nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
						};
					});
				})
				.catch((e) => {
					this.loading = false;
					console.log(e);
				});
		},

		listarPrestadores2() {
			this.preload = true;
			this.$axios.post('reps/listar?page=0', {
				prestador: this.prestador2
			}).then(res => {
				this.preload = false;
				this.listaPrestadores = res.data.map((rep) => {
					return {
						id: rep.id,
						nombre: `${rep.prestadores.nit}-${rep.nombre} - ${rep.municipio.nombre}`,
					}
				})
			}).catch(e => {
				this.preload = false;
				console.log(e);
			})
		},
		//evaluar condiciones cups

		// async evaluarCondicionesEntidad() {
		//   try {
		//     const requiereDiagnostico = await this.eveluarRequiereDiagnostico();
		//     if (!requiereDiagnostico) return;



		//     this.generarOrdenamiento()

		//   } catch (error) {
		//     this.$toast.error('Ocurrió un error al evaluar los condiciones')
		//   }
		// },

		async eveluarRequiereDiagnostico() {
			const idsProcedimientos = this.procedimientosSeleccionados.map(item => ({
				id: item.procedimiento.id,
				cantidad: parseInt(item.cantidad, 10)
			}));

			const data = {
				procedimientos: idsProcedimientos.map(p => p.id),
				cantidad: idsProcedimientos.reduce((acc, p) => {
					acc[p.id] = p.cantidad;
					return acc;
				}, {}),
				consulta_id: this.consulta
			};
			try {
				this.preload = true;
				const response = await this.$axios.post('/cup/evaluar-requiere-diagnostico', data)
				if (response.data === true) {
					return true
				} else {
					this.$swal({
						title: 'No se puede ordenar los servicios',
						text: response.data,
						type: 'error',
						showConfirmButton: true
					})
					return false;
				}
			} catch (error) {
				this.$toast.error('ocurrio un error al realizar la validacion');
				return false;
			} finally {
				this.preload = false
			}
		},
		generarOrdenamiento() {
			if (!this.consulta || this.procedimientosSeleccionados.length === 0) {
				this.$swal({
					title: 'Advertencia',
					text: 'Debe seleccionar al menos un procedimiento antes de generar el ordenamiento.',
					type: 'warning'
				});
				return;
			}

			this.setPreload(true);

			this.$axios.$post(`/ordenamiento/generarOrdenamiento/${this.consulta}/2`, this.procedimientosSeleccionados)
				.then(res => {
					this.$swal({
						title: res.mensaje,
						type: res.type
					});

					if (res.type !== 'error') {
						this.ordenId = res.ordenServicios.id
						this.procesarRecomendaciones().then(() =>
							this.procesarConsentimientos()
						).then(() => {
							this.procedimientosSeleccionados = [];
						})
					}
					this.limpiarFormulario();
				})
				.catch(error => {
					this.$swal({
						title: 'Advertencia',
						text: error?.response?.data?.error || error.message || 'Ocurrió un error al generar el ordenamiento.',
						type: 'warning'
					});
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		procesarRecomendaciones() {
			const promesas = this.procedimientosSeleccionados.map(ser => {
				return this.$axios.$post('/recomendacion-cups/consultar', {
					id: ser.procedimiento.id
				}).then(res => {
					if (res === true) {
						const pdf = {
							tipo: "recomendacionOrdenCup",
							id: ser.procedimiento.id,
							consulta: this.consulta
						};
						this.printRecomendacion(pdf);
					}
				});
			});

			return Promise.all(promesas).then(() => {
				return this.procedimientosActivos();
			});
		},

		procesarConsentimientos() {
			const procedimientoIds = this.procedimientosSeleccionados.map(proc => proc.procedimiento.id);

			return this.$axios.$post('/consentimientos-informados/consultar-grupo-procedimientos', {
				ids: procedimientoIds
			}).then(res => {
				this.listaConsentimientos = res;

				if (!this.listaConsentimientos || this.listaConsentimientos.length === 0) {
					return Promise.resolve();
				}

				this.infoConsentimiento = this.unificarConsentimientos(this.listaConsentimientos);

				return this.$swal({
					title: 'Autorización de firma electrónica',
					text: 'Si acepta esta autorización, deberá firmar el consentimiento de manera electrónica.',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#28a745',
					cancelButtonColor: '#d33',
					cancelButtonText: 'Imprimir consentimiento',
					confirmButtonText: 'Firmar electrónicamente',
				}).then(result => {
					if (result.value) {
						this.modalConsentimiento = true;
						this.acepta = true;
					} else {
						this.imprimirConsentimiento();
						this.acepta = false;
					}
				});
			});
		},

		unificarConsentimientos(lista) {
			return lista.reduce((acumulado, item) => {
				acumulado.beneficios += `- ${item.nombre}: ${item.beneficios}\n`;
				acumulado.riesgos += `- ${item.nombre}: ${item.riesgos}\n`;
				acumulado.descripcion += `- ${item.nombre}: ${item.descripcion}\n`;
				acumulado.alternativas += `- ${item.nombre}: ${item.alternativas}\n`;
				acumulado.riesgo_no_aceptar += `- ${item.nombre}: ${item.riesgo_no_aceptar}\n`;
				acumulado.informacion += `- ${item.nombre}: ${item.informacion}\n`;
				acumulado.recomendaciones += `- ${item.nombre}: ${item.recomendaciones}\n`;
				acumulado.procedimientos.push(item.cup_id);
				acumulado.odontologia = item.odontologia || acumulado.odontologia;
				return acumulado;
			}, {
				beneficios: '',
				riesgos: '',
				descripcion: '',
				alternativas: '',
				riesgo_no_aceptar: '',
				informacion: '',
				recomendaciones: '',
				procedimientos: [],
				odontologia: null
			});
		},


		// generarOrdenamiento() {
		// 	if (!this.consulta || this.procedimientosSeleccionados.length === 0) {
		// 		this.$swal({
		// 			title: 'Advertencia',
		// 			text: 'Debe seleccionar al menos un procedimiento antes de generar el ordenamiento.',
		// 			icon: 'warning'
		// 		});
		// 		return;
		// 	}

		// 	this.setPreload(true);

		// 	this.$axios.$post('/ordenamiento/generarOrdenamiento/' + this.consulta + '/2', this.procedimientosSeleccionados)
		// 		.then(res => {
		// 			console.log(res.mensaje);
		// 			this.preload = false;
		// 			this.$swal({
		// 				title: res.mensaje,
		// 				type: res.type,
		// 			});
		// 			this.ordenamientoId = res[0].id;
		// 			this.ordenId = res[0].orden_id
		// 			if (res.type !== 'error') {
		// 				this.procedimientosActivos();
		// 				this.procedimientosSeleccionados.forEach((ser) => {
		// 					this.$axios.$post('/recomendacion-cups/consultar', {
		// 						id: ser.procedimiento.id
		// 					}).then((res) => {
		// 						if (res === true) {
		// 							let pdf = {
		// 								tipo: "recomendacionOrdenCup",
		// 								id: ser.procedimiento.id,
		// 								consulta: this.consulta
		// 							};
		// 							this.printRecomendacion(pdf);
		// 						}
		// 					})
		// 				})

		// 				//validamos si los procedimientos ordenados tienen consentimientos asociados
		// 				const procedimiento_id = this.procedimientosSeleccionados.map(proc => proc.procedimiento.id)
		// 				this.$axios.$post('/consentimientos-informados/consultar-grupo-procedimientos', {
		// 					ids: procedimiento_id
		// 				}).then((res) => {
		// 					this.listaConsentimientos = res

		// 					//concatenamos todos los resultados de consentimientos que lleguen para presentarlos unidos, incluyendo los cup id asociados
		// 					const consentimientoUnificado = this.listaConsentimientos.reduce((acumulado, item) => {
		// 						acumulado.beneficios += `- ${item.nombre}: ${item.beneficios}\n`
		// 						acumulado.riesgos += `- ${item.nombre}: ${item.riesgos}\n`
		// 						acumulado.descripcion += `- ${item.nombre}: ${item.descripcion}\n`
		// 						acumulado.alternativas += `- ${item.nombre}: ${item.alternativas}\n`
		// 						acumulado.riesgo_no_aceptar += `- ${item.nombre}: ${item.riesgo_no_aceptar}\n`
		// 						acumulado.informacion += `- ${item.nombre}: ${item.informacion}\n`
		// 						acumulado.recomendaciones += `- ${item.nombre}: ${item.recomendaciones}\n`
		// 						acumulado.procedimientos.push(item.cup_id)
		// 						acumulado.odontologia = item.odontologia ? item.odontologia : null // si el consentimiento tiene odontología, lo asignamos
		// 						return acumulado
		// 					}, { beneficios: '', riesgos: '', descripcion: '', alternativas: '', riesgo_no_aceptar: '', informacion: '', recomendaciones: '', procedimientos: [], odontologia: null })

		// 					//asignamos el resultado de la concatenación a la variable que muestra los consentimientos
		// 					this.infoConsentimiento = consentimientoUnificado

		// 					if (this.listaConsentimientos.length > 0) {
		// 						this.$swal({
		// 							title: 'Autorizacion de firma electronica de los consentimientos asociados',
		// 							text: "Si acepta esta autorizacion, debera firmar el consentimiento de manera electronica",
		// 							type: 'warning',
		// 							showCancelButton: true,
		// 							confirmButtonColor: '#28a745',
		// 							cancelButtonColor: '#d33',
		// 							cancelButtonText: 'Imprimir consentimiento',
		// 							confirmButtonText: 'Firmar electronicamente',
		// 						}).then((result) => {
		// 							if (result.value) {
		// 								this.modalConsentimiento = true
		// 								//   this.iniciarCamara()
		// 								this.acepta = true
		// 								this.procedimientosSeleccionados = []
		// 							} else {
		// 								this.imprimirConsentimiento()

		// 								this.acepta = false
		// 							}
		// 						})
		// 					} else { this.procedimientosSeleccionados = [] }
		// 				})
		// 			}
		// 			this.limpiarFormulario();
		// 			this.setPreload(false);
		// 		}).catch(error => {
		// 			this.setPreload(false);
		// 			if (error.response && error.response.data && error.response.data.error) {
		// 				this.$swal({
		// 					title: 'Error',
		// 					text: error.response.data.error,
		// 					type: 'error'
		// 				});
		// 			} else {
		// 				this.$swal({
		// 					title: 'Error',
		// 					text: 'Ocurrió un error al generar el ordenamiento.',
		// 					type: 'error'
		// 				});
		// 			}
		// 		})
		// },

		printRecomendacion(pdf) {
			this.$axios.post('pdf', pdf, {
				responseType: "arraybuffer"
			}).then(res => {
				let blob = new Blob([res.data], {
					type: "application/pdf"
				});
				let link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				window.open(link.href, "_blank");
			});
		},

		async iniciarCamara() {
			try {
				const opciones = {
					audio: false,
					video: {
						width: this.camara.width,
						height: this.camara.height
					}
				}
				const stream = await navigator.mediaDevices.getUserMedia(opciones);
				this.$refs.video.srcObject = stream
				this.$refs.video.play();
				// this.streming(stream);
			} catch (error) {

			}
		},

		streming(stream) {
			window.stream = stream;
			this.$refs.video.srcObject = stream;
		},

		tomarFoto() {
			const context = this.$refs.canvas.getContext('2d');
			context.drawImage(this.$refs.video, 0, 0, this.camara.width, this.camara.height);
			console.log('dd', this.$refs.canvas.toDataURL());
		},

		submit() {
			if (!this.$refs.form.validate()) {
				return
			}
			if (this.$refs.firmaPaciente.isEmpty()) {
				this.$swal({
					title: "¡Error!",
					text: "Es necesario firmar para guardar y autorizar el consentimiento informado.",
					type: "warning",
				}); return
			}
			const firma = this.$refs.firmaPaciente.save();
			const datos = {
				orden_id: this.ordenId,
				firma_paciente: this.criterios.firmante === 'Paciente' && this.criterios.aceptacion === 'Si' ? firma : null,
				firmante: this.criterios.firmante,
				numero_documento_representante: this.criterios.documentoRepresentante,
				declaracion_a: this.criterios.declaracion_a,
				declaracion_b: this.criterios.declaracion_b,
				declaracion_c: this.criterios.declaracion_c,
				aceptacion_consentimiento: this.criterios.aceptacion,
				nombre_profesional: this.criterios.nombre_profesional,
				firma_disentimiento: this.criterios.aceptacion === 'No' ? firma : null,
				firma_representante: this.criterios.firmante === 'Representante Legal' && this.criterios.aceptacion === 'Si' ? firma : null,
				nombre_representante: this.criterios.nombre_representante,
				dientes: this.dientesOdontologia,
				embarazo: this.criterios.embarazo,

			}

			this.$axios.$post('/ordenamiento/firmar-consentimientos-orden', datos).then((res) => {
				this.limpiar();
				this.modalConsentimiento = false
			})
		},
		limpiar() {
			this.$refs.firmaPaciente.clear();
			this.criterios = {
				aceptacion: 'Si',
				firmante: null,
				documentoRepresentante: null,
				declaracion_a: 'SI',
				declaracion_b: 'SI',
				declaracion_c: 'SI',
				nombre_profesional: null,
				nombre_representante: null,
				embarazo: null
			}
		},

		imprimirConsentimiento() {
			this.procedimientosSeleccionados.forEach((ser) => {
				this.$axios.$post('/consentimientos-informados/consultar', {
					id: ser.procedimiento.id
				}).then((res) => {

					if (res = true) {
						let pdf = {
							tipo: "consentimientoInformado",
							id: ser.procedimiento.id,
						};
						this.$axios.post('pdf', pdf, {
							responseType: "arraybuffer"
						}).then(res => {
							let blob = new Blob([res.data], {
								type: "application/pdf"
							});
							let link = document.createElement("a");
							link.href = window.URL.createObjectURL(blob);
							window.open(link.href, "_blank");
							this.procedimientosSeleccionados = []
						});
					}
				})
			})
		},

		modalDialogo(item) {
			this.rep_id = '',
				this.dialogoDireccionamiento = true;
			this.direccionamiento.orden_procedimientos_id = item.id
			this.listarPrestadores(item.cup_id, item.orden.consulta.afiliado.entidad_id)

		},

		modalDialogoPreOrden(item) {
			this.index = this.procedimientosSeleccionados.indexOf(item)
			this.dialogoDireccionamientoPreOrden = true;
			this.direccionamientoPreOrden = item
		},

		asignarDireccionamientoPreOrden() {
			this.procedimientosSeleccionados[this.index] = this.direccionamientoPreOrden;
			this.dialogoDireccionamientoPreOrden = false
		},

		asignarDireccionamiento() {
			this.$axios.post('ordenamiento/asignarDireccionamiento', {
				orden_procedimientos_id: this.direccionamiento.orden_procedimientos_id,
				rep_id: this.rep_id
			}).then(res => {
				this.$swal({
					title: 'Orden direccionada con exito.',
					type: 'success',
				});
				this.dialogoDireccionamiento = false;
				this.procedimientosActivos();
			}).catch(e => {
				this.$swal({
					title: 'Direccionamiento fallido.',
					type: 'error',
				});
			})
		},
		imprimir(item) {
			let pdf = {
				tipo: 'servicio',
				id: item.orden_id,
				detalles: {
					id: item.id
				}
			};
			this.$axios.post("/pdf", pdf, {
				responseType: "arraybuffer"
			})
				.then(res => {
					let blob = new Blob([res.data], {
						type: "application/pdf"
					});

					let link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					window.open(link.href, "_blank");
				});
		},
		SendEmail() {
			var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
			if (!regex.test(this.emailEnvio)) {
				return this.$swal.fire({
					title: "Debe ingresar un Email valido",
					icon: "warning",
					type: "error",
				});
			}

			let pdf = {
				tipo: 'servicio',
				enviar: true,
				correo: this.emailEnvio,
				detalles: {
					id: this.datosEnvioEmail.id
				}
			}
			this.$axios.post('pdf', pdf).then(res => {
				this.emailEnvio = null;
				this.datosEnvioEmail = null;
				this.modalEmail = false;
				return this.$swal.fire({
					title: "¡Orden enviada con exito!",
					icon: "success",
					type: "success",
				});
			}).catch(err => (err.response));

		},
		guardarDiente() {
			if (!this.datosDientes.diente || !this.datosDientes.fecha) {
				return this.$toast.error('Diligencie todos los campos para poder agregar');
			}
			const data = {
				diente: this.datosDientes.diente,
				fecha: this.datosDientes.fecha,
			}

			this.dientesOdontologia.push(data);

			this.datosDientes = {
				diente: null,
				fecha: null
			}
		},
		eliminarDiente(item) {
			const index = this.dientesOdontologia.indexOf(item);
			if (index > -1) {
				this.dientesOdontologia.splice(index, 1);
			}

		},

        ordenarCupDesdePaquete(cup) {
        const hoyLocal = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10);

        this.formProcedimientos = {
            procedimiento: cup,
            cantidad: 1,
            observacion: 'Agregado desde paquete',
            codigo: cup.codigo,
            nombre: cup.nombre,
            fechaVigencia: hoyLocal
        };

        this.agregarprocedimientos();
        },

        abrirEditorObservacion(item) {
            this.itemObservacion = item;
            this.observacionTemporal = item.observacion || '';
            this.dialogObservacion = true;
        },

        guardarObservacion() {
            if (this.itemObservacion) {
                this.itemObservacion.observacion = this.observacionTemporal.trim();
            }
            this.dialogObservacion = false;
        }

	}
}

</script>
<style>
.firma {
	border: 2.5px solid #78909C;
	border-radius: 5px;
}

.centrar {
	text-align: center;
}

p {
	text-align: justify;
}
</style>
