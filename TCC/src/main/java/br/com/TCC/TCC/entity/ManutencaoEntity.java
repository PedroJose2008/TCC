package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "Manutencao")
public class ManutencaoEntity  implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	
	// SE FOREM VÁRIAS PEÇAS:
	@OneToMany(mappedBy = "manutencao") 
	private List<PecaEntity> peca;
	
	@ManyToOne
	@JoinColumn(name = "idKit")
	private KitEntity kit;
	
	@ManyToOne
	@JoinColumn(name = "idOrdemServico")
	private OrdemServicoEntity ordemServico;
	
	//id cliente
	@ManyToOne
	@JoinColumn (name = "idCliente")
	private ClienteEntity cliente;
	
	
	@ManyToOne
	@JoinColumn(name = "idMecanico")
	private UsuarioEntity mecanico;
	
	
	
	
	
	
	
	
	public List<PecaEntity> getPeca() {
		return peca;
	}
	public void setPeca(List<PecaEntity> peca) {
		this.peca = peca;
	}
	public KitEntity getKit() {
		return kit;
	}
	public void setKit(KitEntity kit) {
		this.kit = kit;
	}
	public OrdemServicoEntity getOrdemServico() {
		return ordemServico;
	}
	public void setOrdemServico(OrdemServicoEntity ordemServico) {
		this.ordemServico = ordemServico;
	}
	
	
	public ClienteEntity getCliente() {
		return cliente;
	}
	public void setCliente(ClienteEntity cliente) {
		this.cliente = cliente;
	}
	public UsuarioEntity getMecanico() {
		return mecanico;
	}
	public void setMecanico(UsuarioEntity mecanico) {
		this.mecanico = mecanico;
	}


	private String status;
	private LocalDate dataFinalizacao;
	
	
	
	
	
	

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	
	
	

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

	
	
	

	public LocalDate getDataFinalizacao() {
		return dataFinalizacao;
	}
	public void setDataFinalizacao(LocalDate dataFinalizacao) {
		this.dataFinalizacao = dataFinalizacao;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
}
