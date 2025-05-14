import { AutoMap } from '@automapper/classes';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EMAIL_MAX_LEN, END_USER_SCHEMA, PK_NAME, TABLE_NAME, USERNAME_MAX_LEN } from '../constants';

@Entity({ schema: END_USER_SCHEMA, name: TABLE_NAME })
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: PK_NAME })
  public id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: USERNAME_MAX_LEN, nullable: true })
  public username?: string;

  @AutoMap()
  @Column({ type: 'varchar', length: EMAIL_MAX_LEN, nullable: true })
  public email?: string;

  @AutoMap()
  @Index(`IX__${TABLE_NAME}__email_normalized`, { unique: true, nullFiltered: true })
  @Column({ type: 'varchar', length: EMAIL_MAX_LEN, nullable: true })
  public emailNormalized?: string;
}
