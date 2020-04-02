Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.provider "virtualbox" do |v, override|
    v.memory = 512
    v.cpus = 1
    override.vm.network "public_network", bridge: "en0: Wi-Fi (AirPort)"
  end

  config.vm.provider :digital_ocean do |provider, override|
    override.ssh.private_key_path = '~/.ssh/id_rsa'
    provider.ssh_key_name = ENV["DIGITALOCEAN_SSH_KEY_NAME"] || 'vagrant'
    provider.token = ENV['DIGITALOCEAN_API_TOKEN']
    provider.region = "SFO2"

    override.nfs.functional = false
    override.vm.allowed_synced_folder_types = :rsync
  end

  (1.upto 2).each do |i|
    config.vm.define "slave#{i}" do |slave|
    end
  end

  config.vm.define "master", primary: true do |master|
    master.vm.network "forwarded_port", guest: 8089, host: 8089
    master.vm.network "forwarded_port", guest: 5557, host: 5557

    master.vm.provision "ansible" do |ansible|
      # Disable default limit to connect to all the machines
      ansible.limit = "all"
      ansible.playbook = "tasks/provision.yml"
    end

    master.trigger.after :up do |trigger|
      trigger.ruby do |env, machine|
        File.readlines(File.join(__dir__, '.vagrant/provisioners/ansible/inventory/vagrant_ansible_inventory')).each do |line|
          next unless /^master/.match(line)
  
          match = /ansible_host=([\d\.]+)/.match(line)
          puts "locust running on http://#{match.captures[0]}:8089"
          puts `open "http://#{match.captures[0]}:8089"`
        end
      end
    end
  end
end
