import { User } from '../entity/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectmanager1634525414817 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA IF NOT EXISTS `projectmanager`');
    await queryRunner.query('USE `projectmanager`');
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`users`( `id` BIGINT(8) NOT NULL AUTO_INCREMENT, `username` VARCHAR(20) NOT NULL, `email` VARCHAR(50) NOT NULL,`password` VARCHAR(100) NOT NULL,`first_name` VARCHAR(50) NOT NULL,`last_name` VARCHAR(50) NOT NULL,`status` TINYINT(1) NOT NULL DEFAULT 1,`role` ENUM("admin", "pm", "member") NOT NULL DEFAULT member,`birth_date` DATE NULL,`created_at` DATETIME NOT NULL DEFAULT NOW(),`updated_at` DATETIME NOT NULL DEFAULT NOW(),`avatar` longblob NULL, PRIMARY KEY (`id`), UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE, UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE) ENGINE = InnoDB;)',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`projects` (`id` BIGINT(8) NOT NULL AUTO_INCREMENT,`pm_id` BIGINT(8) NOT NULL,`name` VARCHAR(255) NOT NULL,`client` VARCHAR(255) NOT NULL,`description` TEXT NULL,`start_date` DATE NULL,`end_date` DATE NULL,`created_at` DATETIME NOT NULL DEFAULT NOW(),`updated_at` DATETIME NOT NULL DEFAULT NOW(),`status` TINYINT NOT NULL DEFAULT 1,PRIMARY KEY (`id`, `pm_id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,CONSTRAINT `fk_projects_users1`FOREIGN KEY (`pm_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`users__projects`(`user_id` BIGINT(8) NOT NULL,`project_id` BIGINT(8) NOT NULL,PRIMARY KEY (`user_id`, `project_id`),INDEX `fk_user_table_has_project_table_project_table1_idx` (`project_id` ASC) VISIBLE,INDEX `fk_user_table_has_project_table_user_table_idx` (`user_id` ASC) VISIBLE,CONSTRAINT `fk_user_table_has_project_table_user_table`FOREIGN KEY (`user_id`)REFERENCES `new_schema1`.`users` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION,CONSTRAINT `fk_user_table_has_project_table_project_table1`FOREIGN KEY (`project_id`)REFERENCES `projectmanager`.`projects` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`tasks` (`id` BIGINT(8) NOT NULL AUTO_INCREMENT,`project_id` BIGINT(8) NOT NULL,`request_by_id` BIGINT(8) NOT NULL,`assign_to_id` BIGINT(8) NOT NULL,`title` VARCHAR(45) NOT NULL,`notes` TEXT NULL,`due_date` DATE NOT NULL,`status` TINYINT NOT NULL DEFAULT 1,`priority` TINYINT NOT NULL DEFAULT 1,`sequence` INT NULL,`created_at` DATETIME NOT NULL DEFAULT NOW(),`updated_at` DATETIME NOT NULL DEFAULT NOW(),PRIMARY KEY (`id`, `project_id`, `request_by_id`, `assign_to_id`),UNIQUE INDEX `title_UNIQUE` (`title` ASC) VISIBLE,UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,INDEX `fk_task_table_project_table1_idx` (`project_id` ASC) VISIBLE,INDEX `fk_tasks_users2_idx` (`request_by_id` ASC) VISIBLE,INDEX `fk_tasks_users1_idx` (`assign_to_id` ASC) VISIBLE,CONSTRAINT `fk_task_table_project_table1`FOREIGN KEY (`project_id`)REFERENCES `projectmanager`.`projects` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION,CONSTRAINT `fk_tasks_users2` FOREIGN KEY (`request_by_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION,CONSTRAINT `fk_tasks_users1`FOREIGN KEY (`assign_to_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`tasks` (`id` INT NOT NULL,`project_id` BIGINT(8) NOT NULL,`user_id` BIGINT(8) NOT NULL,`title` VARCHAR(255) NOT NULL,`date` DATE NOT NULL,`note` TEXT NULL,`link` VARCHAR(255) NULL,`created_at` DATETIME NOT NULL DEFAULT NOW(),`updated_at` DATETIME NOT NULL DEFAULT NOW(),PRIMARY KEY (`id`, `project_id`, `user_id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,UNIQUE INDEX `title_UNIQUE` (`title` ASC) VISIBLE,INDEX `fk_report_table_project_table1_idx` (`project_id` ASC) VISIBLE,INDEX `fk_report_table_user_table1_idx` (`user_id` ASC) VISIBLE,CONSTRAINT `fk_report_table_project_table1`FOREIGN KEY (`project_id`)REFERENCES `projectmanager`.`projects` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION,CONSTRAINT `fk_report_table_user_table1`FOREIGN KEY (`user_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTIONON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.manager.save(User, {
      username: 'admin2',
      email: 'duyhiep2@gamil.com',
      password: '111111',
      firstName: 'Duy',
      lastName: 'Hiep',
      role: 'admin',
      status: 1,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `projectmanager`.`users`');
    await queryRunner.query('DROP TABLE `projectmanager`.`projects`');
    await queryRunner.query('DROP TABLE `projectmanager`.`users__projects`');
    await queryRunner.query('DROP TABLE `projectmanager`.`tasks`');
    await queryRunner.query('DROP TABLE `projectmanager`.`tasks`');
  }
}
