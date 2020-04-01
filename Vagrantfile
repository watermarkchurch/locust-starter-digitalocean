Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.provider "virtualbox" do |v, override|
    v.memory = 512
    v.cpus = 1
  end

  config.vm.provider :digital_ocean do |provider, override|
    override.ssh.private_key_path = '~/.ssh/id_rsa'
    provider.ssh_key_name = ENV["DIGITALOCEAN_SSH_KEY_NAME"] || 'vagrant'
    provider.token = ENV['DIGITALOCEAN_API_TOKEN']
    provider.region = "SFO2"

    override.nfs.functional = false
    override.vm.allowed_synced_folder_types = :rsync
  end
  
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "tasks/provision.yml"
  end

  config.vm.define "master" do |master|
    master.vm.network "forwarded_port", guest: 8080, host: 8080
  end

  (1.upto 2).each do |i|
    config.vm.define "slave#{i}"
  end
end
