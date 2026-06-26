package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "OrdemServico")
public class OrdemServicoEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@NotNull
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "idCliente")
	@NotNull
	private List<ClienteEntity> cliente;
	
	
	@ManyToOne
	@JoinColumn(name = "idUsuario")
	@NotNull
	private List<UsuarioEntity> usuario;
	
	@ManyToOne
	@JoinColumn(name = "idTipoPagamento")
	@NotNull
	private List<TipoPagamentoEntity> tipoPagamento;
	
	@ManyToOne
	@JoinColumn(name = "idKit")
	@NotNull
	private KitEntity kit;
	
	
	@ManyToOne
	@JoinColumn(name = "idPeca")
	@NotNull
	private PecaEntity peca;
	
	@NotNull
	@Column(precision = 5, scale = 2)
	private BigDecimal valor;
	
	private LocalDate dataAbertura;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<ClienteEntity> getCliente() {
		return cliente;
	}

	public void setCliente(List<ClienteEntity> cliente) {
		this.cliente = cliente;
	}

	public List<UsuarioEntity> getUsuario() {
		return usuario;
	}

	public void setUsuario(List<UsuarioEntity> usuario) {
		this.usuario = usuario;
	}

	public List<TipoPagamentoEntity> getTipoPagamento() {
		return tipoPagamento;
	}

	public void setTipoPagamento(List<TipoPagamentoEntity> tipoPagamento) {
		this.tipoPagamento = tipoPagamento;
	}

	public KitEntity getKit() {
		return kit;
	}

	public void setKit(KitEntity kit) {
		this.kit = kit;
	}

	public PecaEntity getPeca() {
		return peca;
	}

	public void setPeca(PecaEntity peca) {
		this.peca = peca;
	}

	public BigDecimal getValor() {
		return valor;
	}

	public void setValor(BigDecimal valor) {
		this.valor = valor;
	}

	public LocalDate getDataAbertura() {
		return dataAbertura;
	}

	public void setDataAbertura(LocalDate dataAbertura) {
		this.dataAbertura = dataAbertura;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
}
