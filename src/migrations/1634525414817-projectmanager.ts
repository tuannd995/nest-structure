import { createMockUsers } from 'src/mockData/createMockData';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectmanager1634525414817 implements MigrationInterface {
  name = 'projectmanager1634525414817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`users` (`id` bigint(8) NOT NULL AUTO_INCREMENT,`username` varchar(20) NOT NULL,`email` varchar(50) NOT NULL,`password` varchar(100) NOT NULL,`first_name` varchar(50) NOT NULL,`last_name` varchar(50) NOT NULL,`status` tinyint(1) NOT NULL DEFAULT 1,`role` enum("admin", "pm", "member") NOT NULL DEFAULT "member",`birth_date` date NULL,`created_at` datetime NOT NULL DEFAULT NOW(),`updated_at` datetime NOT NULL DEFAULT NOW(),`avatar` varchar(255) NULL,PRIMARY KEY (`id`),UNIQUE INDEX `username_UNIQUE` (`username` ASC),UNIQUE INDEX `email_UNIQUE` (`email` ASC),UNIQUE INDEX `id_UNIQUE` (`id` ASC)) ENGINE = InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`projects` (`id` bigint(8) NOT NULL AUTO_INCREMENT,`pm_id` bigint(8) NOT NULL,`name` varchar(255) NOT NULL,`client` varchar(255) NOT NULL,`description` text NULL,`start_date` date NULL,`end_date` date NULL,`created_at` datetime NOT NULL DEFAULT NOW(),`updated_at` datetime NOT NULL DEFAULT NOW(),`status` tinyint NOT NULL DEFAULT 1,PRIMARY KEY (`id`, `pm_id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,UNIQUE INDEX `name_UNIQUE` (`name` ASC),INDEX `fk_projects_users1_idx` (`pm_id` ASC),CONSTRAINT `fk_projects_users1`FOREIGN KEY (`pm_id`)REFERENCES `projectmanager`.`users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE = InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`users__projects` (`user_id` bigint(8) NOT NULL,`project_id` bigint(8) NOT NULL,PRIMARY KEY (`user_id`, `project_id`),INDEX `fk_user_table_has_project_table_project_table1_idx` (`project_id` ASC) ,INDEX `fk_user_table_has_project_table_user_table_idx` (`user_id` ASC) ,CONSTRAINT `fk_user_table_has_project_table_user_table`FOREIGN KEY (`user_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `fk_user_table_has_project_table_project_table1`FOREIGN KEY (`project_id`)REFERENCES `projectmanager`.`projects` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`tasks` (`id` bigint(8) NOT NULL AUTO_INCREMENT,`project_id` bigint(8) NOT NULL,`request_by_id` bigint(8) NOT NULL,`assign_to_id` bigint(8) NOT NULL,`title` varchar(45) NOT NULL,`notes` text NULL,`due_date` date NOT NULL,`status` tinyint NOT NULL DEFAULT 1,`priority` tinyint NOT NULL DEFAULT 1,`sequence` int NULL,`created_at` datetime NOT NULL DEFAULT NOW(),`updated_at` datetime NOT NULL DEFAULT NOW(),PRIMARY KEY (`id`, `project_id`, `request_by_id`, `assign_to_id`),UNIQUE INDEX `title_UNIQUE` (`title` ASC),UNIQUE INDEX `id_UNIQUE` (`id` ASC),INDEX `fk_task_table_project_table1_idx` (`project_id` ASC) ,INDEX `fk_tasks_users2_idx` (`request_by_id` ASC) ,INDEX `fk_tasks_users1_idx` (`assign_to_id` ASC) ,CONSTRAINT `fk_task_table_project_table1`FOREIGN KEY (`project_id`)REFERENCES `projectmanager`.`projects` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `fk_tasks_users2`FOREIGN KEY (`request_by_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `fk_tasks_users1`FOREIGN KEY (`assign_to_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `projectmanager`.`reports` (`id` bigint(8) NOT NULL,`project_id` bigint(8) NOT NULL,`user_id` bigint(8) NOT NULL,`title` varchar(255) NOT NULL,`date` date NOT NULL,`note` text NULL,`link` varchar(255) NULL,`created_at` datetime NOT NULL DEFAULT NOW(),`updated_at` datetime NOT NULL DEFAULT NOW(),PRIMARY KEY (`id`, `project_id`, `user_id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,UNIQUE INDEX `title_UNIQUE` (`title` ASC) ,INDEX `fk_report_table_project_table1_idx` (`project_id` ASC) ,INDEX `fk_report_table_user_table1_idx` (`user_id` ASC) ,CONSTRAINT `fk_report_table_project_table1`FOREIGN KEY (`project_id`)REFERENCES `projectmanager`.`projects` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION,CONSTRAINT `fk_report_table_user_table1`FOREIGN KEY (`user_id`)REFERENCES `projectmanager`.`users` (`id`)ON DELETE NO ACTION ON UPDATE NO ACTION)ENGINE = InnoDB;',
    );
    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`users` MODIFY avatar varchar(255) ',
    );

    await createMockUsers(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `projectmanager`.`users`');
    await queryRunner.query('DROP TABLE `projectmanager`.`projects`');
    await queryRunner.query('DROP TABLE `projectmanager`.`users__projects`');
    await queryRunner.query('DROP TABLE `projectmanager`.`tasks`');
    await queryRunner.query('DROP TABLE `projectmanager`.`tasks`');
  }
}
