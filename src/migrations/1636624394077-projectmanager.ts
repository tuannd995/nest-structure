import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectmanager1636624394077 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // modify foreign key
    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`projects` DROP FOREIGN KEY `fk_projects_users1`;',
    );
    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`projects` ADD CONSTRAINT `fk_projects_users1` FOREIGN KEY (`pm_id`) REFERENCES `projectmanager`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    );
    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`tasks`  DROP FOREIGN KEY `fk_task_table_project_table1`, DROP FOREIGN KEY `fk_tasks_users1`, DROP FOREIGN KEY `fk_tasks_users2`;',
    );
    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`tasks`  ADD CONSTRAINT `fk_task_table_project_table1` FOREIGN KEY (`project_id`) REFERENCES `projectmanager`.`projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, ADD CONSTRAINT `fk_tasks_users1` FOREIGN KEY (`assign_to_id`) REFERENCES `projectmanager`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, ADD CONSTRAINT `fk_tasks_users2` FOREIGN KEY (`request_by_id`) REFERENCES `projectmanager`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    );

    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`users__projects` DROP FOREIGN KEY `fk_user_table_has_project_table_project_table1`, DROP FOREIGN KEY `fk_user_table_has_project_table_user_table`;',
    );
    await queryRunner.query(
      'ALTER TABLE `projectmanager`.`users__projects`  ADD CONSTRAINT `fk_user_table_has_project_table_project_table1` FOREIGN KEY (`project_id`) REFERENCES `projectmanager`.`projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, ADD CONSTRAINT `fk_user_table_has_project_table_user_table` FOREIGN KEY (`user_id`) REFERENCES `projectmanager`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;',
    );
  }

  public async down(): Promise<void> {
    console.log('down');
  }
}
